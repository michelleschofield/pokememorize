

insert into "games" ("name")
values ('match'),
       ('memory');

insert into "users" ("username", "hashedPassword")
values ('Guest', '$argon2id$v=19$m=65536,t=3,p=4$7zhYWVdi4Nmfa8BRro2WWg$ZW2vh18I6UygevqOpBF5BIZA6Nj9NjXtMnP1HZVuwQg');

insert into "studySets" ("userId", "title")
values (1, 'Popular Pokemon');

insert into "cards" ("studySetId", "pokemonId", "infoKey")
values (1, 133, 'flavor_text_entries');
       (1, 197, 'flavor_text_entries'),
       (1, 94, 'flavor_text_entries'),
       (1, 1, 'flavor_text_entries'),
       (1, 6, 'flavor_text_entries'),


insert into "users" ("username", "hashedPassword")
values ('Shelly', '$argon2id$v=19$m=65536,t=3,p=4$HtXL1/ugd0Btd+EO3EhJZQ$IbAzazpQRgQyo3H5BiGegc94loWLrU2ZSuCP8RXGbDM');

insert into "studySets" ("userId", "title")
values (2, 'Gen 1 starters');

insert into "studySets" ("userId", "title")
values (2, 'Turtle Pokemon');

insert into "cards" ("studySetId", "pokemonId", "infoKey")
values (2, 1, 'flavor_text_entries'),
       (2, 2, 'flavor_text_entries'),
       (2, 3, 'flavor_text_entries'),
       (2, 4, 'flavor_text_entries'),
       (2, 5, 'flavor_text_entries'),
       (2, 6, 'flavor_text_entries'),
       (2, 7, 'flavor_text_entries'),
       (2, 8, 'flavor_text_entries'),
       (2, 9, 'flavor_text_entries');

insert into "cards" ("studySetId", "pokemonId", "infoKey")
values (3, 7, 'flavor_text_entries'),
       (3, 8, 'flavor_text_entries'),
       (3, 9, 'flavor_text_entries'),
       (3, 213, 'flavor_text_entries'),
       (3, 324, 'flavor_text_entries'),
       (3, 387, 'flavor_text_entries'),
       (3, 388, 'flavor_text_entries'),
       (3, 389, 'flavor_text_entries'),
       (3, 564, 'flavor_text_entries'),
       (3, 565, 'flavor_text_entries');

insert into "sharedSets" ("studySetId", "userId")
values (2, 1),
       (3, 1);
