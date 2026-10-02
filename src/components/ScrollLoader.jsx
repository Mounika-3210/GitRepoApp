import React from "react";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

function ScrollLoader({
  loading,
  hasMore,
}) {
  if (!hasMore) {
    return (
      <Typography
        textAlign="center"
        color="text.secondary"
        sx={{ py: 5 }}
      >
        You have reached the end of the results.
      </Typography>
    );
  }

  if (!loading) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        py: 5,
      }}
    >
      <CircularProgress size={28} />
      <Typography color="text.secondary">
        Loading more repositories...
      </Typography>
    </Box>
  );
}

export default ScrollLoader;
