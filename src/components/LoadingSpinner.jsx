import React from "react";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

function LoadingSpinner({
  text = "Loading...",
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <CircularProgress size={32} />
      <Typography
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        {text}
      </Typography>
    </Box>
  );
}

export default LoadingSpinner;
