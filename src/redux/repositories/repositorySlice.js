import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  repositories: [],
  loading: false,
  error: "",
  page: 1,
  hasMore: true,
  timeRange: 30,
  totalCount: 0,
};

const repositorySlice = createSlice({
  name: "repositories",
  initialState,
  reducers: {
    fetchRepositoriesRequest: (state, action) => {
      state.loading = true;
      state.error = "";

      if (action.payload.page === 1) {
        state.repositories = [];
        state.page = 1;
        state.hasMore = true;
      }
    },

    fetchRepositoriesSuccess: (state, action) => {
      state.loading = false;

      const { items, page, totalCount } = action.payload;

      if (page === 1) {
        state.repositories = items;
      } else {
        const existingIds = new Set(
          state.repositories.map(item => item.id)
        );

        const newItems = items.filter(
          item => !existingIds.has(item.id)
        );

        state.repositories = [
          ...state.repositories,
          ...newItems,
        ];
      }

      state.page = page;
      state.totalCount = totalCount;

      state.hasMore =
        items.length > 0 &&
        state.repositories.length < 1000;
    },

    fetchRepositoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    setTimeRange: (state, action) => {
      state.timeRange = action.payload;
      state.repositories = [];
      state.page = 1;
      state.hasMore = true;
      state.error = "";
    },
  },
});

export const {
  fetchRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  setTimeRange,
} = repositorySlice.actions;

export default repositorySlice.reducer;
