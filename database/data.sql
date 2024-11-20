

insert into "games" ("name")
values ('match'),
       ('memory');

insert into "users" ("username", "hashedPassword")
values ('Guest', '$argon2id$v=19$m=65536,t=3,p=4$7zhYWVdi4Nmfa8BRro2WWg$ZW2vh18I6UygevqOpBF5BIZA6Nj9NjXtMnP1HZVuwQg');

insert into "studySets" ("userId", "title")
values (1, 'Gen 1 starters');

insert into "cards" ("studySetId", "pokemonId", "infoKey")
values (1, 1, 'flavor_text_entries'),
       (1, 2, 'flavor_text_entries'),
       (1, 3, 'flavor_text_entries'),
       (1, 4, 'flavor_text_entries'),
       (1, 5, 'flavor_text_entries'),
       (1, 6, 'flavor_text_entries'),
       (1, 7, 'flavor_text_entries'),
       (1, 8, 'flavor_text_entries'),
       (1, 9, 'flavor_text_entries')
