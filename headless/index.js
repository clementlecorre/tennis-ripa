const { chromium } = require('playwright')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const globalConfig = require("../preset-config/global.json")
const constants = require("../helpers/const.js")
const logger = require("../logger/logger");
const configEnv = require("../config.js");

dayjs.extend(customParseFormat)
const bookTennis = async (configfile, date) => {
  let messagelog = "";
  let log = function (value) {
    logger.info(value)
    messagelog += value + "\n";
  };
  const config = require(configfile)
  log(`${dayjs().format()} - date: ` + date.toString())
  config.date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()

  log(`${dayjs().format()} - date: ` + config.date)
  log(`${dayjs().format()} - Booking tennis court with config: ` + config.name)
  log(`${dayjs().format()} - Starting searching tennis`)
  const browser = await chromium.launch({ headless: constants.ChromeHeadless, slowMo: 0, timeout: 120000 })

  log(`${dayjs().format()} - Browser started`)
  const page = await browser.newPage()
  page.setDefaultTimeout(120000)

  await gotoWithRetry(page, 'https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=tennis&view=start&full=1')

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('#button_suivi_inscription'),
  ])
  await popup.waitForLoadState()
  await popup.fill('#username-login', configEnv.tennis.account.username)
  await popup.fill('#password-login', configEnv.tennis.account.password)
  await popup.click('section >> button')

  log(`${dayjs().format()} - User connected`)


  // wait for login redirection before continue
  await page.waitForSelector('.main-informations')

  // wait
  let nowDate = new Date()
  let endDate = new Date()
  endDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds())
  let delta = endDate - nowDate
  log(`${dayjs().format()} - Waiting ${delta/60}s `)
  await sleep(delta)
  log(`${dayjs().format()} - Waiting done`)

  try {
    for (const location of config.locations) {
      log(`${dayjs().format()} - Search at ${location}`)
      await page.goto('https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=recherche&view=recherche_creneau#!')

      // select tennis location
      await page.type('.tokens-input-text', location)
      await page.waitForSelector(`.tokens-suggestions-list-element >> text="${location}"`)
      await page.click(`.tokens-suggestions-list-element >> text="${location}"`)

      // select date
      await page.click('#when')
      const date = dayjs(config.date, 'D/MM/YYYY')
      await page.waitForSelector(`[dateiso="${date.format('DD/MM/YYYY')}"]`)
      await page.click(`[dateiso="${date.format('DD/MM/YYYY')}"]`)
      await page.waitForSelector('.date-picker', { state: 'hidden' })

      await page.click('#rechercher')

      // wait until the results page is fully loaded before continue
      await page.waitForLoadState('domcontentloaded')

      hoursLoop:
      for (const hour of config.hours) {
        const dateDeb = `[datedeb="${date.format('YYYY/MM/DD')} ${hour}:00:00"]`
        if (await page.$(dateDeb)) {
          if (await page.isHidden(dateDeb)) {
            await page.click(`#head${location.replaceAll(' ', '')}${hour}h .panel-title`)
          }

          const slots = await page.$$(dateDeb)
          for (const slot of slots) {
            const bookSlotButton = `[courtid="${await slot.getAttribute('courtid')}"]${dateDeb}`
            const [priceType, courtType] = (
                await (await page.$(`.price-description:left-of(${bookSlotButton})`)).innerHTML()
            ).split('<br>')
            if (!config.priceType.includes(priceType) || !config.courtType.includes(courtType)) {
              continue
            }
            await page.click(bookSlotButton)

            break hoursLoop
          }
        }
      }
      if (await page.title() !== 'Paris | TENNIS - Reservation') {
        log(`${dayjs().format()} - Failed to find reservation for ${location}`)
        continue
      }

      await page.waitForLoadState('domcontentloaded')

      for (const [i, player] of globalConfig.players.entries()) {
        if (i > 0 && i < globalConfig.players.length) {
          await page.click('.addPlayer')
        }
        await page.waitForSelector(`[name="player${i + 1}"]`)
        await page.fill(`[name="player${i + 1}"] >> nth=0`, player.lastName)
        await page.fill(`[name="player${i + 1}"] >> nth=1`, player.firstName)
      }

      await page.keyboard.press('Enter')

      await page.waitForSelector('#order_select_payment_form #paymentMode', { state: 'attached' })
      const paymentMode = await page.$('#order_select_payment_form #paymentMode')
      await paymentMode.evaluate(el => {
        el.removeAttribute('readonly')
        el.style.display = 'block'
      })
      await paymentMode.fill('existingTicket')

      const submit = await page.$('#order_select_payment_form #envoyer')
      submit.evaluate(el => el.classList.remove('hide'))
      await submit.click()

      await page.waitForSelector('.confirmReservation')

      log(`${dayjs().format()} - Réservation faite : ${((
          await (await page.$('.address')).textContent()
      ).trim().replace(/( ){2,}/g, ' '))}`)
      log(`pour le ${((
          await (await page.$('.date')).textContent()
      ).trim().replace(/( ){2,}/g, ' '))}`)
      break
    }
    await page.screenshot({ path: 'success.png' })
  } catch (e) {
    log(e)
    await page.screenshot({ path: 'failure.png' })
    throw messagelog + `\n\n` + e
  }

  await browser.close()
  return messagelog
}

module.exports = {
  bookTennis
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function addZ(n){return n<10? '0'+n:''+n;}

const gotoWithRetry = async (page, url, retryCount = 3) => {
  if (retryCount < 0) {
    logger.warn(`Failed to navigate to ${url} after 3 retries.`)
  }
  await Promise.all([
    page.goto(url, {
      timeout: 120 * 1000,
      waitUntil: 'load',
    }),
    page.waitForResponse((response) => response.ok(), { timeout: 8000 }),
  ]).catch(() => {
    gotoWithRetry(page, url, retryCount - 1);
  });
};