import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  codeFrequency: [],
  commitActivity: [],
  contributors: [],
  loading: false,
  error: "",
};

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    fetchStatisticsRequest: state => {
      state.loading = true;
      state.error = "";
      state.codeFrequency = [];
      state.commitActivity = [];
      state.contributors = [];
    },

    fetchStatisticsSuccess: (state, action) => {
      state.loading = false;
      state.error = "";
      state.codeFrequency =
        action.payload.codeFrequency;
      state.commitActivity =
        action.payload.commitActivity;
      state.contributors =
        action.payload.contributors;
    },

    fetchStatisticsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearStatistics: state => {
      state.codeFrequency = [];
      state.commitActivity = [];
      state.contributors = [];
      state.loading = false;
      state.error = "";
    },
  },
});

export const {
  fetchStatisticsRequest,
  fetchStatisticsSuccess,
  fetchStatisticsFailure,
  clearStatistics,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
