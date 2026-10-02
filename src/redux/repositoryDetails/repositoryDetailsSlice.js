import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  repository: null,
  loading: false,
  error: "",
};

const repositoryDetailsSlice = createSlice({
  name: "repositoryDetails",
  initialState,
  reducers: {
    fetchRepositoryRequest: state => {
      state.loading = true;
      state.error = "";
    },

    fetchRepositorySuccess: (state, action) => {
      state.loading = false;
      state.error = "";
      state.repository = action.payload;
    },

    fetchRepositoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearRepository: state => {
      state.repository = null;
      state.loading = false;
      state.error = "";
    },
  },
});

export const {
  fetchRepositoryRequest,
  fetchRepositorySuccess,
  fetchRepositoryFailure,
  clearRepository,
} = repositoryDetailsSlice.actions;

export default repositoryDetailsSlice.reducer;
