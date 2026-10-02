import React, {
  useEffect,
  useRef,
} from "react";

import {
  Alert,
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchRepositoriesRequest,
  setTimeRange,
} from "../redux/repositories/repositorySlice";

import RepositoryCard from "../components/RepositoryCard";
import ScrollLoader from "../components/ScrollLoader";

function RepositoryList() {
  const dispatch = useDispatch();
  const loaderRef = useRef(null);

  const {
    repositories,
    loading,
    error,
    timeRange,
    page,
    hasMore,
  } = useSelector(
    state => state.repositories
  );

  useEffect(() => {
    if (repositories.length === 0) {
      dispatch(
        fetchRepositoriesRequest({
          days: timeRange,
          page: 1,
        })
      );
    }
  }, [dispatch, repositories.length, timeRange]);

  useEffect(() => {
    const loader = loaderRef.current;

    if (!loader) return undefined;

    const observer =
      new IntersectionObserver(
        entries => {
          const first = entries[0];

          if (
            first.isIntersecting &&
            !loading &&
            hasMore
          ) {
            dispatch(
              fetchRepositoriesRequest({
                days: timeRange,
                page: page + 1,
              })
            );
          }
        },
        {
          rootMargin: "300px",
          threshold: 0,
        }
      );

    observer.observe(loader);

    return () => {
      observer.disconnect();
    };
  }, [
    dispatch,
    loading,
    hasMore,
    page,
    timeRange,
  ]);

  const handleTimeRangeChange = event => {
    const days = Number(
      event.target.value
    );

    dispatch(setTimeRange(days));

    dispatch(
      fetchRepositoriesRequest({
        days,
        page: 1,
      })
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fbff 0%, #ffffff 60%, #f6f8fc 100%)",
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: "center",
            mb: 5,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: {
                xs: "2.2rem",
                md: "3.3rem",
              },
            }}
          >
            Most Starred Repos
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1.5,
              fontSize: "1.05rem",
            }}
          >
            Discover the most popular GitHub
            repositories created recently.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: {
              xs: "stretch",
              sm: "flex-end",
            },
            mb: 4,
          }}
        >
          <FormControl
            fullWidth
            sx={{
              maxWidth: {
                xs: "100%",
                sm: 230,
              },
            }}
          >
            <InputLabel>
              Created Within
            </InputLabel>

            <Select
              value={timeRange}
              label="Created Within"
              onChange={
                handleTimeRangeChange
              }
            >
              <MenuItem value={7}>
                Last 1 Week
              </MenuItem>

              <MenuItem value={14}>
                Last 2 Weeks
              </MenuItem>

              <MenuItem value={30}>
                Last 1 Month
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <Box>
          {repositories.map(
            (repository, index) => (
              <RepositoryCard
                key={repository.id}
                repository={repository}
                index={index}
              />
            )
          )}
        </Box>

        <Box
          ref={loaderRef}
          sx={{ height: 10 }}
        />

        <ScrollLoader
          loading={loading}
          hasMore={hasMore}
        />
      </Container>
    </Box>
  );
}

export default RepositoryList;
