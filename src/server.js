import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';

import { indexRouter } from './routes/index';
import setGlobalMiddleware from './middleware/global';
import Staff from './models/staff'

const redis = new Redis();

const isProduction = process.env.NODE_ENV === 'production';
const SESSION_LIFETIME = 60 * 60 * 1000 * 2;
const app = express();

const RedisStore = connectRedis(session);


setGlobalMiddleware(app);

isProduction && app.set('trust proxy', 1);

app.use(session({
  store: new RedisStore({
    url: isProduction && process.env.REDISTOGO_URL
  }),
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: isProduction,
    maxAge: SESSION_LIFETIME,
    sameSite: true,
  }
}));


setGlobalMiddleware(app);

app.use('/api/v1', indexRouter);

app.get('/confirm/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = await redis.get(id);

  const staffExists = await Staff.query().findById( userId )
  if (!staffExists) {
    return res.status(404).json({ status: 'error', message: "Invalid confirmation email link" });
  }

  if (userId) {
    await Staff.query().patchAndFetchById(userId , { hasConfirmed: true });
    res.status(200).json({ status: "success", message: "Email Confirmation ok" });
  } else {
    res.status(400).json({ status: "error", message: "Invalid confirmation email link" });
  }
})


app.all('*', (req, res) => {
  res.status(404).send('Not Found');
});

export default app;
