import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";

import {
  fetchRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
} from "./repositorySlice";

import {
  searchRepositories,
} from "../../services/githubApi";

import {
  getCreatedDate,
} from "../../utils/dateUtils";

function* fetchRepositories(action) {
  try {
    const { days, page } = action.payload;

    const createdDate = getCreatedDate(days);

    const data = yield call(
      searchRepositories,
      createdDate,
      page
    );

    yield put(
      fetchRepositoriesSuccess({
        items: data.items || [],
        totalCount: data.total_count || 0,
        page,
      })
    );
  } catch (error) {
    let message =
      "Unable to fetch repositories from GitHub.";

    if (
      error.response?.status === 403
    ) {
      message =
        "GitHub API rate limit reached. Please wait and try again.";
    }

    yield put(
      fetchRepositoriesFailure(message)
    );
  }
}

function* repositorySaga() {
  yield takeLatest(
    fetchRepositoriesRequest.type,
    fetchRepositories
  );
}

export default repositorySaga;
