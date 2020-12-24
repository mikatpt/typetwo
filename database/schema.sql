CREATE DATABASE IF NOT EXISTS typetwo;

\c typetwo;

CREATE TABLE IF NOT EXISTS accounts (
  id                   SERIAL,
  compound_id          VARCHAR(255) NOT NULL,
  user_id              INTEGER NOT NULL,
  provider_type        VARCHAR(255) NOT NULL,
  provider_id          VARCHAR(255) NOT NULL,
  provider_account_id  VARCHAR(255) NOT NULL,
  refresh_token        TEXT,
  access_token         TEXT,
  access_token_expires TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id            SERIAL,
  user_id       INTEGER NOT NULL,
  expires       TIMESTAMPTZ NOT NULL,
  session_token VARCHAR(255) NOT NULL,
  access_token  VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
  id             SERIAL,
  name           VARCHAR(255),
  email          VARCHAR(255),
  email_verified TIMESTAMPTZ,
  image          VARCHAR(255),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS verification_requests (
  id         SERIAL,
  identifier VARCHAR(255) NOT NULL,
  token      VARCHAR(255) NOT NULL,
  expires    TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS metrics (
  id            SERIAL,
  user_id       INTEGER NOT NULL,
  totalwords    REAL NOT NULL,
  totaltime     INTEGER NOT NULL,
  fastestwpm    REAL NOT NULL,
  lastwpm       REAL NOT NULL,
  lasterrors    INTEGER NOT NULL,
  lastaccuracy  REAL NOT NULL,
  fifths        INTEGER[],
  singles       jsonb,
  doubles       jsonb,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL,
  user_id INTEGER NOT NULL,
  wordset INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS settings_user_id_idx
  ON settings(user_id);

CREATE UNIQUE INDEX IF NOT EXISTS metrics_user_id_idx
  ON metrics(user_id);

CREATE UNIQUE INDEX IF NOT EXISTS compound_id
  ON accounts(compound_id);

CREATE INDEX IF NOT EXISTS provider_account_id
  ON accounts(provider_account_id);

CREATE INDEX IF NOT EXISTS provider_id
  ON accounts(provider_id);

CREATE INDEX IF NOT EXISTS user_id
  ON accounts(user_id);

CREATE UNIQUE INDEX IF NOT EXISTS session_token
  ON sessions(session_token);

CREATE UNIQUE INDEX IF NOT EXISTS access_token
  ON sessions(access_token);

CREATE UNIQUE INDEX IF NOT EXISTS email
  ON users(email);

CREATE UNIQUE INDEX IF NOT EXISTS token
  ON verification_requests(token);

GRANT ALL PRIVILEGES ON DATABASE typetwo TO student;
GRANT ALL ON ALL TABLES IN SCHEMA public TO student;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO student;
