import { redisConfig } from './config/index';
import express from 'express';
import http from 'http';
import session from 'express-session';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import redis from 'redis';
import cors from 'cors';
import dotenv from 'dotenv';
import socketIo from 'socket.io';
const RedisStore = require('connect-redis')(session);
const RedisClient = redis.createClient(redisConfig);
const app = express();

import usersRouter from './src/routes/users';
//-----------------------------------------------------
// GLOBAL
// ----------------------------------------------------
const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATH'],
  credentials: true, // enable set cookie
};
dotenv.config({ path: __dirname + '/.env' });

//-----------------------------------------------------
// MIDDLEWARES
// ----------------------------------------------------
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.disable('x-powered-by');

//-----------------------------------------------------
// REDIS CONFIGURATION
// ----------------------------------------------------
RedisClient.on('connect', () => {
  console.log(
    'Success -> connection Redis client on port:',
    RedisClient['connection_options'].port,
  );
});

RedisClient.on('error', (err) => {
  console.log('Failed -> Redis error: ', err);
});

//-----------------------------------------------------
// REDIS SESSION CONFIG
// ----------------------------------------------------
app.use(
  session({
    secret: 'kqjsfkskghfkgkcjqlzoeihzsnf',
    name: 'formationRemote',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
    store: new RedisStore({
      ...redisConfig,
      client: RedisClient,
      ttl: 86400,
    }),
  }),
);

//-----------------------------------------------------
// CHECK IF SESSION EXIST
// ----------------------------------------------------
app.use((req, res, next) => {
  if (!req.session) {
    return next(new Error('no session'));
  }
  next();
});

//-----------------------------------------------------
// MONGOOSE CONNECT TO MONGODB
// ----------------------------------------------------

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    // useCreateIndex: true
  })
  .then(() => {
    console.log('Success -> MongoDB starting');
  })
  .catch((err) => {
    console.log('Failed -> ', err);
  });

//-----------------------------------------------------
// ROUTES
// ----------------------------------------------------

app.use('/api/v1/student', usersRouter);

//-----------------------------------------------------
// SERVER WEBSOCKET INSTEAD OF HTTP PROTOCOL
// ----------------------------------------------------
const server = http.createServer(app);
const io = socketIo(server);

//-----------------------------------------------------
// TEST CONNECTION WEBSOCKET
// ----------------------------------------------------
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

//-----------------------------------------------------
// SERVER NODE EXPRESS CONNECTION
// ----------------------------------------------------

server.listen(process.env.PORT_SERVER_NODE, () =>
  console.log(`Success -> connection Server node on port: ${process.env.PORT_SERVER_NODE}`),
);

module.exports = app;
