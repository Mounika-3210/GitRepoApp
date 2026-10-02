import { all, fork } from "redux-saga/effects";

import repositorySaga from "../repositories/repositorySaga";
import statisticsSaga from "./statisticsSaga";
import repositoryDetailsSaga from "./repositoryDetailsSaga";

function* rootSaga() {
  yield all([
    fork(repositorySaga),
    fork(statisticsSaga),
    fork(repositoryDetailsSaga),
  ]);
}

export default rootSaga;