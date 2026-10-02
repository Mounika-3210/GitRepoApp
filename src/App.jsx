import React from "react";
import { Routes, Route } from "react-router-dom";

import RepositoryList from "./pages/RepositoryList";
import RepositoryDetails from "./pages/RepositoryDetails";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<RepositoryList />}
      />

      <Route
        path="/repository/:owner/:repo"
        element={<RepositoryDetails />}
      />
    </Routes>
  );
}

export default App;