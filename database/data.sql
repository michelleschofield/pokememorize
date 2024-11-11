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

insert into "users" ("username", "hashedPassword", "role")
values ('Guest', '$argon2id$v=19$m=65536,t=3,p=4$7zhYWVdi4Nmfa8BRro2WWg$ZW2vh18I6UygevqOpBF5BIZA6Nj9NjXtMnP1HZVuwQg', 'guest');
