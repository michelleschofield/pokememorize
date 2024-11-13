-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

insert into "games" ("name")
values ('match'),
       ('memory');

insert into "users" ("username", "hashedPassword")
values ('Guest', '$argon2id$v=19$m=65536,t=3,p=4$7zhYWVdi4Nmfa8BRro2WWg$ZW2vh18I6UygevqOpBF5BIZA6Nj9NjXtMnP1HZVuwQg');

insert into "studySets" ("userId", "title")
values (1, 'newSet');

insert into "cards" ("studySetId", "pokemonId", "endpoint", "infoKey")
values (1, 1, 'pokemon', 'types')
