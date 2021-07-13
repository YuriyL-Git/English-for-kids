import mongoose from 'mongoose';

const cardsShema = new mongoose.Schema({
  data: Array,
});

export default mongoose.model('CardsShema', cardsShema);
