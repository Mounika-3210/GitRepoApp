import {
  configureStore,
} from "@reduxjs/toolkit";

import createSagaMiddleware
  from "redux-saga";

import repositoryReducer
  from "./repositories/repositorySlice";

import statisticsReducer
  from "./statistics/statisticsSlice";

import repositoryDetailsReducer
  from "./repositoryDetails/repositoryDetailsSlice";

import rootSaga from "./sagas/rootSaga";

const sagaMiddleware =
  createSagaMiddleware();

const store = configureStore({
  reducer: {
    repositories: repositoryReducer,
    statistics: statisticsReducer,
    repositoryDetails:
      repositoryDetailsReducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
