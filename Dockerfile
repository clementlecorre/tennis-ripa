FROM mcr.microsoft.com/playwright:v1.27.0-focal

ENV TZ=Europe/Paris

WORKDIR /app
COPY . .
RUN npm install && \
    npx playwright install

ENTRYPOINT ["npm", "start", "--", "--async-stack-traces"]