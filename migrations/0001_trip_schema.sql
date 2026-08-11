-- Trip companion schema (ISS-2202).
--
-- Scoped by `trip_slug` throughout so a second trip is a new set of rows rather
-- than a schema change. Dates are stored as ISO `YYYY-MM-DD` strings and times
-- as `HH:MM` local to the place they happen — a 19:30 dinner in Praiano is
-- 19:30 there, not a UTC instant to convert while standing in Praiano.

CREATE TABLE days (
  trip_slug   TEXT NOT NULL,
  date        TEXT NOT NULL,           -- YYYY-MM-DD
  place       TEXT NOT NULL,           -- 'Varenna, Lake Como'
  country     TEXT NOT NULL,
  summary     TEXT,                    -- one line: what this day is
  lodging     TEXT,                    -- where you sleep that night
  PRIMARY KEY (trip_slug, date)
);

CREATE TABLE items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_slug   TEXT NOT NULL,
  date        TEXT NOT NULL,
  kind        TEXT NOT NULL,           -- flight | train | lodging | dining | activity | transfer
  title       TEXT NOT NULL,
  detail      TEXT,
  start_time  TEXT,                    -- HH:MM local, NULL when not yet known
  end_time    TEXT,
  cost        TEXT,                    -- '€2,774' / '$282.25' — display form, currencies are mixed
  cost_note   TEXT,                    -- e.g. 'mapping unverified'
  confirmed   INTEGER NOT NULL DEFAULT 0,   -- 1 = booked and paid for
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX items_by_day ON items (trip_slug, date, sort_order);

CREATE TABLE ideas (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_slug   TEXT NOT NULL,
  date        TEXT NOT NULL,
  title       TEXT NOT NULL,
  detail      TEXT,
  -- The question that produced this suggestion. Stored so that in October
  -- "why did we save this" has an answer.
  source_q    TEXT,
  saved_by    TEXT NOT NULL,
  promoted_at TEXT,                    -- set when it graduates into `items`
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX ideas_by_day ON ideas (trip_slug, date, created_at);

CREATE TABLE notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_slug   TEXT NOT NULL,
  date        TEXT NOT NULL,
  author      TEXT NOT NULL,
  body        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX notes_by_day ON notes (trip_slug, date, created_at);

-- Loose ends carried over from the original itinerary export, tracked in the
-- app rather than buried in a document nobody reopens.
CREATE TABLE questions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_slug   TEXT NOT NULL,
  question    TEXT NOT NULL,
  date        TEXT,                    -- the day it affects, when it has one
  resolved_at TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX questions_by_trip ON questions (trip_slug, sort_order);
