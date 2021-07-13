import { Request, Response, Router } from 'express';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import copyFolderSync from '../../helpers/copy';
import isAdminMiddleware from '../../middlewares/isAdminMiddlware';
import CardsShema from '../../models/CardShema';
import { Card, Category } from '../../interfaces/card-array';
import { DbCards } from '../../interfaces/db-cards';
import cardsDefaultData from '../../cards-data/cards-data';

const adminRouter = Router();

adminRouter.put('/update-icon-category', isAdminMiddleware, async (req: Request, res: Response) => {
  const newpath = path.join(__dirname, '../../public/category-icon/');

  if (!req.files) {
    return;
  }
  const file = req.files.file as UploadedFile;
  const filename = file.name;
  const { category } = req.body;

  const dataCards = Array.from(await CardsShema.find()).pop() as unknown as DbCards;

  (dataCards.data[0] as Array<Category>).forEach((cat) => {
    if (cat.category === category) cat.image = file.name;
  });

  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: 'File upload failed', code: 200 });
    }
    CardsShema.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
      if (err) return res.send({ error: err, code: 500 });
      return res.status(200).send({ message: 'File Uploaded', code: 200 });
    });
  });
});

adminRouter.put('/update-category-name', isAdminMiddleware, async (req: Request, res: Response) => {
  const { oldCategoryName, newCategoryName } = req.body;
  const dataCards = Array.from(await CardsShema.find()).pop() as unknown as DbCards;

  (dataCards.data[0] as Array<Category>).forEach((cat) => {
    if (cat.category === oldCategoryName) cat.category = newCategoryName;
  });

  CardsShema.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
    if (err) return res.send({ error: err, code: 500 });
    return res.status(200).send({ message: 'Category updated', code: 200 });
  });
});

adminRouter.post('/remove-category', isAdminMiddleware, async (req: Request, res: Response) => {
  const category = req.body.category as string;
  const dataCards = Array.from(await CardsShema.find()).pop() as unknown as DbCards;

  const categoryIndex = (dataCards.data[0] as Array<Category>).findIndex((cat) => cat.category === category);

  dataCards.data[0] = (dataCards.data[0] as Array<Category>).filter((cat) => cat.category !== category);
  dataCards.data.splice(categoryIndex + 1, 1);

  CardsShema.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
    if (err) return res.send({ error: err, code: 500 });
    return res.status(200).send({ message: 'Category updated', code: 200 });
  });
});

adminRouter.post('/add-category', isAdminMiddleware, async (req: Request, res: Response) => {
  const newpath = path.join(__dirname, '../../public/category-icon/');

  if (!req.files) {
    return;
  }
  const file = req.files.file as UploadedFile;
  const filename = file.name;
  const { category } = req.body;

  const dataCards = Array.from(await CardsShema.find()).pop() as unknown as DbCards;

  (dataCards.data[0] as Array<Category>).push({ category, image: filename });
  dataCards.data.push([]);

  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: 'File upload failed', code: 200 });
    }
    CardsShema.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
      if (err) return res.send({ error: err, code: 500 });
      return res.status(200).send({ message: 'File Uploaded', code: 200 });
    });
  });
});

adminRouter.post('/reset-db', isAdminMiddleware, async (req: Request, res: Response) => {
  const { reset } = req.body;
  if (reset !== 'resetDb') {
    res.send({ error: 'wrong request', code: 500 });
  } else {
    const dataCards = Array.from(await CardsShema.find()).pop() as unknown as DbCards;
    dataCards.data = cardsDefaultData;

    const publicPath = path.join(__dirname, '../../public/');
    const publicArchive = path.join(__dirname, '../../publicArchive/public/');
    fs.rmdirSync(publicPath, { recursive: true });
    copyFolderSync(publicArchive, publicPath);

    CardsShema.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
      if (err) return res.send({ error: err, code: 500 });
      return res.status(200).send({ message: 'Db reset to the default state', code: 200 });
    });
  }
});

adminRouter.post('/remove-word', isAdminMiddleware, async (req: Request, res: Response) => {
  const word = req.body.word as string;
  const translation = req.body.translation as string;

  const dataCards = Array.from(await CardsShema.find()).pop() as unknown as DbCards;

  for (let i = 1; i < dataCards.data.length; i++) {
    for (let j = 0; j < dataCards.data[i].length; j++) {
      const card = dataCards.data[i][j] as unknown as Card;
      if (card.word === word && card.translation === translation) {
        dataCards.data[i].splice(j, 1);
      }
    }
  }

  CardsShema.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
    if (err) return res.send({ error: err, code: 500 });
    return res.status(200).send({ message: 'Words updated', code: 200 });
  });
});

adminRouter.put('/update-word-files', isAdminMiddleware, async (req: Request, res: Response) => {
  const pathImg = path.join(__dirname, '../../public/img/');
  const pathSound = path.join(__dirname, '../../public/audio/');

  if (!req.files) {
    return;
  }
  const fileSound = req.files.fileSound as UploadedFile;
  const fileSoundName = fileSound?.name || '';
  const fileImg = req.files.fileImg as UploadedFile;
  const fileImgName = fileImg?.name || '';

  if (fileImg) {
    fileImg.mv(`${pathImg}${fileImgName}`, (err) => {
      if (err) {
        res.status(500).send({ message: 'Image upload failed', code: 200 });
      }
    });
  }

  if (fileSound) {
    fileSound.mv(`${pathSound}${fileSoundName}`, (error) => {
      if (error) {
        res.status(500).send({ message: 'Sound upload failed', code: 200 });
      }
      res.status(200).send({ message: 'Files uploaded successfully', code: 200 });
    });
  }
});

adminRouter.put('/update-word', isAdminMiddleware, async (req: Request, res: Response) => {
  const card = req.body.card as Card;
  const origWord = req.body.origWord as string;
  const origTranslation = req.body.origTranslation as string;
  const dataCards = Array.from(await CardsShema.find()).pop() as unknown as DbCards;

  for (let i = 1; i < dataCards.data.length; i++) {
    for (let j = 0; j < dataCards.data[i].length; j++) {
      const currentCard = dataCards.data[i][j] as unknown as Card;
      if (currentCard.word === origWord && currentCard.translation === origTranslation) {
        dataCards.data[i][j] = card;
      }
    }
  }

  CardsShema.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
    if (err) return res.send({ error: err, code: 500 });
    return res.status(200).send({ message: 'Words updated', code: 200 });
  });
});

adminRouter.post('/add-word', isAdminMiddleware, async (req: Request, res: Response) => {
  const card = req.body.card as Card;
  const category = req.body.category as string;
  const dataCards = Array.from(await CardsShema.find()).pop() as unknown as DbCards;

  const categoryIndex = (dataCards.data[0] as Category[]).findIndex((cat) => cat.category === category);
  dataCards.data[categoryIndex + 1].push(card);

  CardsShema.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
    if (err) return res.send({ error: err, code: 500 });
    return res.status(200).send({ message: 'Words updated', code: 200 });
  });
});

export default adminRouter;
