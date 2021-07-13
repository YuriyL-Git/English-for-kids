import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import getCategoryIndex from '../helpers/get-category-index';
import { CardContent } from '../models/card-content';
import playSound from '../helpers/play-sound';
import getStatisticList from '../helpers/get-statistic-list';
import { compareByPropDown, compareByPropUp } from '../helpers/sort-comparator';
import { StatisticProperties } from '../models/statistic-properties';
import getCardByWord from '../helpers/get-card-by-word';
import { Category } from '../models/category';
import { StatisticItem } from '../models/statistic-item';

const CARDS_QTY = 8;

const stateInit = {
  playMode: false,
  gameIsStarted: false,
  currentCategory: '',
  gameSequence: [] as Array<CardContent>,
  statistic: [] as Array<StatisticItem>,
  repeatWordsList: [] as Array<CardContent>,
  currentGameAttempts: [] as Array<boolean>,
  showSuccessMessage: false,
  showFailMessage: false,
  categoryToSortByIndex: -1,
  sortedUp: true,
  timerIsStarted: false,
  timerShowMessage: null as NodeJS.Timeout | null,
  btnBlink: '',
  cards: [] as Array<Array<CardContent | Category>>,
  hostMessage: false,
};

interface SortType {
  category: StatisticProperties;
  index: number;
}

const appSlice = createSlice({
  name: 'app',
  initialState: stateInit,
  reducers: {
    toggleTrainMode: state => {
      state.playMode = !state.playMode;
      if (!state.playMode) state.gameIsStarted = false;
      state.currentGameAttempts = [];
    },

    startGame: state => {
      state.gameIsStarted = true;
      state.currentGameAttempts = [];
    },

    stopGame: state => {
      state.gameIsStarted = false;
      state.currentGameAttempts = [];
      if (state.showSuccessMessage) state.showSuccessMessage = false;
      if (state.showFailMessage) state.showFailMessage = false;
    },

    setCurrentCategory: (state, action: PayloadAction<string>) => {
      state.currentCategory = action.payload;
    },

    setCardsList: (
      state,
      action: PayloadAction<Array<Array<CardContent | Category>>>,
    ) => {
      state.cards = action.payload;
    },

    createGameSequence: state => {
      const categoryIndex = getCategoryIndex(
        state.currentCategory,
        state.cards,
      );
      let sequence = state.cards[
        categoryIndex + 1
      ] as unknown as Array<CardContent>;
      if (state.currentCategory === 'repeat-words')
        sequence = state.repeatWordsList;

      state.gameSequence = sequence.slice().sort(() => 0.5 - Math.random());
      if (state.gameSequence.length > 0)
        playSound(state.gameSequence[state.gameSequence.length - 1].audioSrc);
    },

    cardClickedInPlayMode: (state, action: PayloadAction<string>) => {
      if (state.gameSequence.length === 0) return;

      // -- clicked card index in statistic table ----------------------
      const clickedIndex = state.statistic.findIndex(
        statistic => statistic.word === action.payload,
      );

      const getSuccessRate = (index: number) =>
        Math.floor(
          (state.statistic[index].successCount /
            (state.statistic[index].successCount +
              state.statistic[index].errorsCount)) *
            100,
        );

      // -- if clicked card is wrong ----------------------------------
      if (
        state.gameSequence[state.gameSequence.length - 1].word !==
        action.payload
      ) {
        playSound('signals/fail.wav');
        state.currentGameAttempts.push(false);
        const currentWord =
          state.gameSequence[state.gameSequence.length - 1].word;
        const currentIndex = state.statistic.findIndex(
          statistic => statistic.word === currentWord,
        );
        state.statistic[currentIndex].errorsCount++;
        state.statistic[currentIndex].successRate =
          getSuccessRate(currentIndex);

        // save statistic to local storage
        const statisticObj = JSON.stringify(state.statistic);
        localStorage.setItem('statistic', statisticObj);
        return;
      }
      // -- if clicked card is correct ---------------------------------
      playSound('signals/success.mp3');
      state.statistic[clickedIndex].successCount++;
      state.statistic[clickedIndex].successRate = getSuccessRate(clickedIndex);
      state.currentGameAttempts.push(true);
      state.gameSequence.splice(-1);

      // save statistic to local storage
      const statisticObj = JSON.stringify(state.statistic);
      localStorage.setItem('statistic', statisticObj);

      // -- if there is word left, play the next word ------------------
      if (state.gameSequence.length > 0) {
        playSound(state.gameSequence[state.gameSequence.length - 1].audioSrc);
        return;
      }

      // -- no words left, generate end game ----------------------------
      const failedAttempts = state.currentGameAttempts.filter(
        att => att === false,
      ).length;

      // -- generate fail message -------------------------------------
      if (failedAttempts > 0) {
        playSound('signals/game-fail.mp3');
        state.showFailMessage = true;
        return;
      }

      // -- generate success message -------------------------------------
      playSound('signals/game-success.ogg');
      state.showSuccessMessage = true;
    },

    cardClickedInTrainMode: (state, action: PayloadAction<string>) => {
      const statisticIndex = state.statistic.findIndex(
        statistic => statistic.word === action.payload,
      );
      if (state.statistic[statisticIndex])
        state.statistic[statisticIndex].trainingClicks++;

      // save statistic to local storage
      const statisticObj = JSON.stringify(state.statistic);
      localStorage.setItem('statistic', statisticObj);
    },

    sortByProperty: (state, action: PayloadAction<SortType>) => {
      if (state.categoryToSortByIndex === action.payload.index) {
        state.sortedUp = !state.sortedUp;

        if (state.sortedUp)
          state.statistic.sort(compareByPropUp(action.payload.category));
        if (!state.sortedUp)
          state.statistic.sort(compareByPropDown(action.payload.category));
        return;
      }
      state.categoryToSortByIndex = action.payload.index;

      if (typeof state.statistic[0][action.payload.category] === 'string') {
        state.statistic.sort(compareByPropUp(action.payload.category));
        state.sortedUp = true;
      } else {
        state.statistic.sort(compareByPropDown(action.payload.category));
        state.sortedUp = false;
      }
    },

    setStatistic: state => {
      state.statistic = getStatisticList(state.cards);
    },

    resetStatistic: state => {
      localStorage.removeItem('statistic');
      state.statistic = getStatisticList(state.cards);
      state.categoryToSortByIndex = -1;
    },

    setTimerIsStarted: (state, action: PayloadAction<boolean>) => {
      state.timerIsStarted = action.payload;
    },

    setTimer: (state, action: PayloadAction<NodeJS.Timeout>) => {
      state.timerShowMessage = action.payload;
    },

    stopTimer: state => {
      if (state.timerShowMessage) {
        clearTimeout(state.timerShowMessage);
        state.timerIsStarted = false;
      }
    },

    setDifficultWordsArray: state => {
      const items = [...state.statistic]
        .filter(item => item.successRate !== -1 && item.successRate !== 100)
        .sort(compareByPropUp('successRate'))
        .slice(0, CARDS_QTY);

      const cardsList = items.map(item =>
        getCardByWord(state.cards, item.word, item.translation),
      );
      state.repeatWordsList = cardsList as Array<CardContent>;
    },

    setBtnBlink: state => {
      state.btnBlink = 'blink-effect';
    },

    removeBtnBlink: state => {
      state.btnBlink = '';
    },

    setHostMessage: state => {
      state.hostMessage = true;
    },
  },
});

export const {
  toggleTrainMode,
  startGame,
  stopGame,
  setCurrentCategory,
  createGameSequence,
  cardClickedInPlayMode,
  cardClickedInTrainMode,
  resetStatistic,
  sortByProperty,
  setDifficultWordsArray,
  setTimerIsStarted,
  setTimer,
  stopTimer,
  setBtnBlink,
  removeBtnBlink,
  setCardsList,
  setStatistic,
  setHostMessage,
} = appSlice.actions;

export default appSlice.reducer;
