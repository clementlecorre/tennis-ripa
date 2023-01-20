CREATE SEQUENCE quote_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE configs (
    id int DEFAULT nextval('quote_id_seq'::regclass) NOT NULL  PRIMARY KEY,
    userID int NOT NULL,
    userName varchar(50) NOT NULL,
    startSession timestamp with time zone NOT NULL,
    endSession timestamp with time zone,
    reservationDate timestamp with time zone NOT NULL,
    config varchar(255),
    scheduleTime timestamp with time zone,
    errDetails text,
    successDetails text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);