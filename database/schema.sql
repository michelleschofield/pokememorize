set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "username" text unique,
  "hashedPassword" text
);

CREATE TABLE "studySets" (
  "studySetId" serial PRIMARY KEY,
  "title" text,
  "userId" integer
);

CREATE TABLE "sharedSets" (
  "studySetId" integer,
  "userId" integer,
  PRIMARY KEY ("studySetId", "userId")
);

CREATE TABLE "cards" (
  "cardId" serial PRIMARY KEY,
  "studySetId" integer,
  "pokemonId" integer,
  "infoKey" text
);

CREATE TABLE "scores" (
  "scoreId" serial PRIMARY KEY,
  "score" integer,
  "studySetId" integer,
  "userId" integer,
  "scoredOn" timestamptz,
  "gameId" integer
);

CREATE TABLE "games" (
  "gameId" serial PRIMARY KEY,
  "name" text
);

ALTER TABLE "studySets" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "sharedSets" ADD FOREIGN KEY ("studySetId") REFERENCES "studySets" ("studySetId");

ALTER TABLE "sharedSets" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "cards" ADD FOREIGN KEY ("studySetId") REFERENCES "studySets" ("studySetId");

ALTER TABLE "scores" ADD FOREIGN KEY ("studySetId") REFERENCES "studySets" ("studySetId");

ALTER TABLE "scores" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "scores" ADD FOREIGN KEY ("gameId") REFERENCES "games" ("gameId");
