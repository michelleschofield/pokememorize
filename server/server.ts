import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { authMiddleware, ClientError, errorMiddleware } from './lib/index.js';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};
type Auth = {
  username: string;
  password: string;
};
type Payload = {
  userId: number;
};
type Card = {
  studySetId: number;
  pokemonId: number;
  infoKey: string;
};

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sqlInsert = `
      insert into "users" ("username", "hashedPassword")
      values ($1, $2)
      returning "userId", "username"
    `;
    const params = [username, hashedPassword];
    const result = await db.query<User>(sqlInsert, params);
    const user = result.rows[0];
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
    const params = [username];
    const result = await db.query<User>(sql, params);
    const user = result.rows[0];
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

app.get('/api/sets', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
      select "title", "studySetId"
      from "studySets"
      where "userId" = $1
      order by "studySetId" desc;
    `;
    const result = await db.query(sql, [req.user?.userId]);
    const studySets = result.rows;
    res.status(200).json(studySets);
  } catch (err) {
    next(err);
  }
});

app.get('/api/sets/:studySetId', authMiddleware, async (req, res, next) => {
  try {
    const { studySetId } = req.params;
    validateId(studySetId);
    const sql = `
      select "title", "studySetId"
      from "studySets"
      where "userId" = $1 and "studySetId" = $2;
    `;
    const result = await db.query(sql, [req.user?.userId, studySetId]);
    const studySet = result.rows[0];
    if (!studySet)
      throw new ClientError(404, `study set ${studySetId} not found`);
    res.status(200).json(studySet);
  } catch (err) {
    next(err);
  }
});

app.get('/api/cards/:studySetId', authMiddleware, async (req, res, next) => {
  try {
    const { studySetId } = req.params;
    validateId(studySetId);
    const sql = `
      select *
        from "cards"
        where "studySetId" = $1
        order by "cardId" desc;
    `;
    const result = await db.query(sql, [studySetId]);
    const cards = result.rows;
    res.json(cards);
  } catch (err) {
    next(err);
  }
});

app.get('/api/card/:cardId', authMiddleware, async (req, res, next) => {
  try {
    const { cardId } = req.params;
    validateId(cardId);
    const sql = `
      select *
      from "cards"
      where "cardId" = $1
    `;
    const result = await db.query(sql, [cardId]);
    const card = result.rows[0];
    if (!card) throw new ClientError(404, `card ${cardId} not found`);
    res.json(card);
  } catch (err) {
    next(err);
  }
});

app.post('/api/sets', authMiddleware, async (req, res, next) => {
  try {
    const { title } = req.body;
    const user = req.user as Payload;

    if (!title) throw new ClientError(400, `title field is required`);
    const sql = `
      insert into "studySets" ("title", "userId")
      values ($1, $2)
      returning *;
    `;
    const result = await db.query(sql, [title, user.userId]);
    const studySet = result.rows[0];
    res.status(201).json(studySet);
  } catch (err) {
    next(err);
  }
});

app.post('/api/cards', authMiddleware, async (req, res, next) => {
  try {
    const { studySetId, pokemonId, infoKey } = req.body;
    validateCard(req.body);

    await checkOwnsSet(studySetId, req.user?.userId);

    const sql = `
      insert into "cards" (
        "studySetId",
        "pokemonId",
        "infoKey")
      values ($1, $2, $3)
      returning *;
    `;
    const result = await db.query(sql, [studySetId, pokemonId, infoKey]);
    const card = result.rows[0];
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
});

app.post('/api/scores', authMiddleware, async (req, res, next) => {
  try {
    const { score, studySetId, gameId } = req.body;
    if (!score || !studySetId || !gameId) {
      throw new ClientError(400, 'not all fields provided');
    }
    validateId(studySetId);

    const sql = `
      insert into "scores" ("score", "studySetId", "gameId", "userId")
      values ($1, $2, $3, $4)
      returning *;
    `;

    const params = [score, studySetId, gameId, req.user?.userId];

    const result = await db.query(sql, params);
    const insertedScore = result.rows[0];
    res.status(201).json(insertedScore);
  } catch (err) {
    next(err);
  }
});

app.put('/api/sets/:studySetId', authMiddleware, async (req, res, next) => {
  try {
    const { studySetId } = req.params;
    const { title } = req.body;

    validateId(studySetId);
    if (!title) throw new ClientError(400, 'title field is required');

    const sql = `
      update "studySets"
      set "title" = $1
      where "studySetId" = $2 and "userId" = $3
      returning *;
    `;

    const result = await db.query(sql, [title, studySetId, req.user?.userId]);
    const updatedSet = result.rows[0];
    if (!updatedSet)
      throw new ClientError(404, `Study set ${studySetId} not found`);
    res.json(updatedSet);
  } catch (err) {
    next(err);
  }
});

app.put('/api/cards/:cardId', authMiddleware, async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { studySetId, pokemonId, infoKey } = req.body;

    console.log('cardId', cardId);
    console.log('card');
    console.log(studySetId);
    console.log(pokemonId);
    console.log(infoKey);

    validateId(cardId);
    validateCard(req.body);
    await checkOwnsSet(studySetId, req.user?.userId);

    const sql = `
      update "cards"
      set "pokemonId" = $1,
          "infoKey" = $2
      where "cardId" = $3 and "studySetId" = $4
      returning *;
    `;

    const params = [pokemonId, infoKey, cardId, studySetId];
    const result = await db.query(sql, params);
    const updatedCard = result.rows[0];
    if (!updatedCard) throw new ClientError(404, `Card ${cardId} not found`);
    res.json(updatedCard);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/cards/:cardId', authMiddleware, async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { userId } = req.user as User;
    const studySetId = await getStudySetId(+cardId);

    validateId(cardId);
    await checkOwnsSet(studySetId, userId);

    const sql = `
      delete
      from "cards"
      where "cardId" = $1 and "studySetId" = $2
      returning *;
    `;

    const result = await db.query(sql, [cardId, studySetId]);
    const deleted = result.rows[0];
    if (!deleted) throw new ClientError(404, `card ${cardId} not found`);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/sets/:studySetId', authMiddleware, async (req, res, next) => {
  try {
    console.log('you reached the delete endpoint');
    const { studySetId } = req.params;
    const { userId } = req.user as User;

    validateId(studySetId);
    await checkOwnsSet(studySetId, userId);

    const cardSql = `
      delete
      from "cards"
      where "studySetId" = $1
      returning *;
    `;

    await db.query(cardSql, [studySetId]);

    const setSql = `
      delete
      from "studySets"
      where "studySetId" = $1 and "userId" = $2
      returning *;
    `;

    const result = await db.query(setSql, [studySetId, userId]);
    const deleted = result.rows[0];
    if (!deleted)
      throw new ClientError(404, `study set ${studySetId} not found`);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});

async function getStudySetId(cardId: number): Promise<number> {
  const sql = `
    select "studySetId"
    from "cards"
    where "cardId" = $1
  `;
  const result = await db.query(sql, [cardId]);
  const studySet = result.rows[0];
  if (!studySet) throw new ClientError(404, `card ${cardId} not found`);
  return studySet.studySetId;
}

async function checkOwnsSet(
  studySetId: unknown,
  userId: unknown
): Promise<void> {
  const validationSql = `
      select *
      from "studySets"
      where "studySetId" = $1
        and "userId" = $2
      `;
  const validationResult = await db.query(validationSql, [studySetId, userId]);
  if (!validationResult.rows[0]) {
    throw new ClientError(401, `User cannot edit set ${studySetId}`);
  }
}

function validateCard(card: Card): void {
  const { studySetId, pokemonId, infoKey } = card;
  if (!studySetId || !pokemonId || !infoKey) {
    throw new ClientError(400, 'not all fields provided');
  }
  if (!Number.isInteger(pokemonId) || !Number.isInteger(studySetId)) {
    throw new ClientError(400, 'invalid information');
  }
}

function validateId(id: string): void {
  if (!Number.isInteger(+id))
    throw new ClientError(400, `${id} is not a valid id`);
}
