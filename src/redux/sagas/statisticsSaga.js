import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";

import {
  fetchStatisticsRequest,
  fetchStatisticsSuccess,
  fetchStatisticsFailure,
} from "../statistics/statisticsSlice";

import {
  getCodeFrequency,
  getCommitActivity,
  getContributorsActivity,
} from "../../services/githubApi";

function* fetchStatistics(action) {
  try {
    const { owner, repo } = action.payload;

    console.log(
      "Fetching statistics for:",
      owner,
      repo
    );

    const codeFrequency = yield call(
      getCodeFrequency,
      owner,
      repo
    );

    const commitActivity = yield call(
      getCommitActivity,
      owner,
      repo
    );

    const contributors = yield call(
      getContributorsActivity,
      owner,
      repo
    );

    yield put(
      fetchStatisticsSuccess({
        codeFrequency: Array.isArray(codeFrequency)
          ? codeFrequency
          : [],
        commitActivity: Array.isArray(commitActivity)
          ? commitActivity
          : [],
        contributors: Array.isArray(contributors)
          ? contributors
          : [],
      })
    );
  } catch (error) {
    console.error("Statistics error:", error);

    let message =
      "Unable to load repository activity.";

    if (error.code === "GITHUB_RATE_LIMIT") {
      message = error.message;
    } else if (error.response?.status === 404) {
      message =
        "Repository activity was not found.";
    } else if (error.response?.status === 422) {
      message =
        "GitHub cannot calculate statistics for this repository because the repository is too large for this statistics endpoint.";
    } else if (error.response?.status === 403) {
      message =
        "GitHub rejected the statistics request. Please try again later.";
    } else if (error.message) {
      message = error.message;
    }

    yield put(
      fetchStatisticsFailure(message)
    );
  }
}

function* statisticsSaga() {
  yield takeLatest(
    fetchStatisticsRequest.type,
    fetchStatistics
  );
}

export default statisticsSaga;
