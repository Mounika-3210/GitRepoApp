import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";

import {
  fetchRepositoryRequest,
  fetchRepositorySuccess,
  fetchRepositoryFailure,
} from "../repositoryDetails/repositoryDetailsSlice";

import {
  getRepository,
} from "../../services/githubApi";

function* fetchRepository(action) {
  try {
    const { owner, repo } = action.payload;

    const repository = yield call(
      getRepository,
      owner,
      repo
    );

    yield put(
      fetchRepositorySuccess(repository)
    );
  } catch (error) {
    let message =
      "Unable to load repository.";

    if (error.response?.status === 404) {
      message = "Repository was not found.";
    } else if (
      error.response?.status === 403
    ) {
      message =
        "GitHub API rate limit reached. Please wait and try again.";
    }

    yield put(
      fetchRepositoryFailure(message)
    );
  }
}

function* repositoryDetailsSaga() {
  yield takeLatest(
    fetchRepositoryRequest.type,
    fetchRepository
  );
}

export default repositoryDetailsSaga;
