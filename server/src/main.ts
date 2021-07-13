import mongoose from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fileupload, { UploadedFile } from 'express-fileupload';
import User from './models/User';
import CardsShema from './models/CardShema';
import cardsData from './cards-data/cards-data';
import passport from './servises/auth/paspost';
import { Card, Category } from './interfaces/card-array';
import isAdminMiddleware from './middlewares/isAdminMiddlware';
import adminRouter from './routes/admin/admin-router';
import { DbCards } from './interfaces/db-cards';

const PORT = process.env.PORT || 4000;
dotenv.config();

mongoose.connect(
  'mongodb+srv://LipcheyY:ekmnhfabjktn16@cluster0.lo9lo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true },
  (err: Error) => {
    if (err) throw new Error(`Error connecting to mongo:`);
    console.log('Connected to Mongo');
  },
);

// Middlewares
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(`${__dirname}/public`));
app.use(fileupload());
app.use(express.static('files'));

// ============= Routes ===============================================
app.use('/', adminRouter);
/* ------- user register ---------------------------------------------*/
app.post('/register', async (req, res: Response) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
    isAdmin: true,
  });
  await newUser.save();
  res.send('Success');
});
/* ------------------------------------------------------------------- */

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('success');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.send('success');
});

app.get('/user', (req, res) => {
  res.send(req.user);
});

app.get('/cards-data', async (req, res) => {
  const dataCards = Array.from(await CardsShema.find()).pop() as unknown as DbCards;
  const cardsArray = dataCards.data;
  res.send(cardsArray);
});

app.listen(PORT, () => {
  console.log('Server started on port: ', PORT);
});
