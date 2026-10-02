import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import ForkRightRoundedIcon from "@mui/icons-material/ForkRightRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  fetchStatisticsRequest,
} from "../redux/statistics/statisticsSlice";

import {
  fetchRepositoryRequest,
} from "../redux/repositoryDetails/repositoryDetailsSlice";

import ActivityCharts from "../components/ActivityCharts";

function RepositoryDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { owner, repo } = useParams();

  const repositoryFromState =
    location.state?.repository;

  const repositoryFromRedux =
    useSelector(
      state =>
        state.repositoryDetails?.repository
    );

  const repositoryLoading =
    useSelector(
      state =>
        state.repositoryDetails?.loading
    );

  const repositoryError =
    useSelector(
      state =>
        state.repositoryDetails?.error
    );

  const repository =
    repositoryFromState ||
    repositoryFromRedux;

  const {
    loading,
    error,
    codeFrequency,
    commitActivity,
    contributors,
  } = useSelector(
    state => state.statistics
  );

  const [metric, setMetric] =
    useState("commits");

  useEffect(() => {
    if (
      !repositoryFromState &&
      owner &&
      repo &&
      !repositoryFromRedux
    ) {
      dispatch(
        fetchRepositoryRequest({
          owner,
          repo,
        })
      );
    }
  }, [
    dispatch,
    owner,
    repo,
    repositoryFromState,
    repositoryFromRedux,
  ]);

  const repositoryOwner =
    repository?.owner?.login;

  const repositoryName =
    repository?.name;

  useEffect(() => {
    if (
      repositoryOwner &&
      repositoryName
    ) {
      dispatch(
        fetchStatisticsRequest({
          owner: repositoryOwner,
          repo: repositoryName,
        })
      );
    }
  }, [
    dispatch,
    repositoryOwner,
    repositoryName,
  ]);

  const retryStatistics = () => {
    if (
      repositoryOwner &&
      repositoryName
    ) {
      dispatch(
        fetchStatisticsRequest({
          owner: repositoryOwner,
          repo: repositoryName,
        })
      );
    }
  };

  const formatNumber = value =>
    Number(value || 0).toLocaleString();

  const summaryItems = useMemo(
    () => [
      {
        label: "Stars",
        value: formatNumber(
          repository?.stargazers_count
        ),
        icon: <StarRoundedIcon />,
      },
      {
        label: "Issues",
        value: formatNumber(
          repository?.open_issues_count
        ),
        icon: <BugReportRoundedIcon />,
      },
      {
        label: "Forks",
        value: formatNumber(
          repository?.forks_count
        ),
        icon: <ForkRightRoundedIcon />,
      },
      {
        label: "Watchers",
        value: formatNumber(
          repository?.watchers_count
        ),
        icon: <VisibilityRoundedIcon />,
      },
    ],
    [repository]
  );

  if (
    !repository &&
    repositoryLoading
  ) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={45} />

          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ mt: 3 }}
          >
            Loading repository...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (
    !repository &&
    repositoryError
  ) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">
          {repositoryError}
        </Alert>

        <Button
          sx={{ mt: 3 }}
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() => navigate("/")}
        >
          Back to repositories
        </Button>
      </Container>
    );
  }

  if (!repository) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h5"
          fontWeight={800}
        >
          Repository information is unavailable.
        </Typography>

        <Button
          sx={{ mt: 3 }}
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() => navigate("/")}
        >
          Back to repositories
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fbff 0%, #ffffff 55%, #f6f8fc 100%)",
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Button
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() => navigate("/")}
          sx={{
            mb: 3,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Back to repositories
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 4,
            border:
              "1px solid rgba(15,23,42,0.08)",
            boxShadow:
              "0 20px 60px rgba(15,23,42,0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
            }}
          >
            <Box
              component="img"
              src={
                repository.owner?.avatar_url
              }
              alt={
                repository.owner?.login ||
                repository.name
              }
              sx={{
                width: {
                  xs: 82,
                  sm: 110,
                },
                height: {
                  xs: 82,
                  sm: 110,
                },
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
                boxShadow:
                  "0 8px 25px rgba(15,23,42,0.15)",
              }}
            />

            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.7rem",
                  },
                  wordBreak: "break-word",
                }}
              >
                {repository.name}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  lineHeight: 1.7,
                }}
              >
                {repository.description ||
                  "No description available."}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{
                  mt: 2,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  icon={<StarRoundedIcon />}
                  label={`${formatNumber(
                    repository.stargazers_count
                  )} stars`}
                />

                <Chip
                  icon={<BugReportRoundedIcon />}
                  label={`${formatNumber(
                    repository.open_issues_count
                  )} issues`}
                />

                <Chip
                  label={`@${repository.owner?.login}`}
                />
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Button
                variant="contained"
                startIcon={<GitHubIcon />}
                href={
                  repository.html_url
                }
                target="_blank"
                rel="noreferrer"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: "none",
                  fontWeight: 800,
                }}
              >
                Open on GitHub
              </Button>
            </Box>
          </Box>
        </Paper>

        <Grid
          container
          spacing={2}
          sx={{ mt: 2 }}
        >
          {summaryItems.map(item => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={item.label}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border:
                    "1px solid rgba(15,23,42,0.08)",
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "rgba(37,99,235,0.10)",
                        color: "#2563eb",
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.label}
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={900}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
              gap: 2,
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  fontSize: {
                    xs: "1.6rem",
                    md: "2rem",
                  },
                }}
              >
                Repository Activity
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Weekly activity for the last year
              </Typography>
            </Box>

            <FormControl
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 220,
                },
              }}
            >
              <InputLabel>
                Activity Type
              </InputLabel>

              <Select
                value={metric}
                label="Activity Type"
                onChange={event =>
                  setMetric(
                    event.target.value
                  )
                }
              >
                <MenuItem value="commits">
                  Commits
                </MenuItem>

                <MenuItem value="additions">
                  Additions
                </MenuItem>

                <MenuItem value="deletions">
                  Deletions
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loading && (
            <Paper
              elevation={0}
              sx={{
                minHeight: 430,
                borderRadius: 4,
                border:
                  "1px solid rgba(15,23,42,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 3,
              }}
            >
              <CircularProgress size={45} />

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mt: 3 }}
              >
                Preparing repository activity...
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  maxWidth: 550,
                }}
              >
                GitHub may need a few seconds to
                calculate weekly repository statistics.
              </Typography>
            </Paper>
          )}

          {!loading && error && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                border:
                  "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  Unable to load activity
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  If you have made many requests while
                  testing, GitHub's unauthenticated
                  request limit may have been reached.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={
                    <RefreshRoundedIcon />
                  }
                  onClick={
                    retryStatistics
                  }
                  sx={{
                    mt: 3,
                    textTransform: "none",
                    fontWeight: 800,
                  }}
                >
                  Try Again
                </Button>
              </Box>
            </Paper>
          )}

          {!loading && !error && (
            <ActivityCharts
              metric={metric}
              codeFrequency={
                codeFrequency
              }
              commitActivity={
                commitActivity
              }
              contributors={
                contributors
              }
            />
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default RepositoryDetails;
