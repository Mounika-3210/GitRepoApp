import React from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useNavigate } from "react-router-dom";

function RepositoryCard({
  repository,
  index,
}) {
  const navigate = useNavigate();

  const openRepository = () => {
    navigate(
      `/repository/${repository.owner.login}/${repository.name}`,
      {
        state: {
          repository,
        },
      }
    );
  };

  const formatDate = date => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <Card
      onClick={openRepository}
      sx={{
        mb: 2.5,
        borderRadius: 3,
        cursor: "pointer",
        overflow: "hidden",
        border:
          "1px solid rgba(15,23,42,0.08)",
        transition:
          "transform .25s ease, box-shadow .25s ease",
        animation: `repositoryAppear .5s ease ${
          index * 0.04
        }s both`,

        "@keyframes repositoryAppear": {
          from: {
            opacity: 0,
            transform: "translateY(15px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            "0 18px 45px rgba(15,23,42,0.12)",
        },

        "&:hover .repo-arrow": {
          transform: "translateX(5px)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 3 },
          "&:last-child": {
            pb: { xs: 2, sm: 3 },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2.5,
            alignItems: "center",
          }}
        >
          <Avatar
            src={repository.owner.avatar_url}
            alt={repository.owner.login}
            sx={{
              width: { xs: 58, sm: 76 },
              height: { xs: 58, sm: 76 },
              flexShrink: 0,
            }}
          />

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                wordBreak: "break-word",
              }}
            >
              {repository.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                mb: 1.5,
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {repository.description ||
                "No description available."}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ flexWrap: "wrap" }}
            >
              <Chip
                icon={<StarRoundedIcon />}
                label={repository.stargazers_count}
                size="small"
              />

              <Chip
                icon={<BugReportRoundedIcon />}
                label={`${repository.open_issues_count} issues`}
                size="small"
              />

              <Chip
                label={`@${repository.owner.login}`}
                size="small"
              />
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Last pushed:{" "}
              <strong>
                {formatDate(
                  repository.pushed_at
                )}
              </strong>
            </Typography>
          </Box>

          <Box
            className="repo-arrow"
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background:
                "rgba(37,99,235,0.08)",
              color: "#2563eb",
              transition:
                "transform .25s ease",
            }}
          >
            <ArrowForwardRoundedIcon />
          </Box>
        </Box>

        <Button
          variant="text"
          startIcon={<GitHubIcon />}
          onClick={event => {
            event.stopPropagation();
            openRepository();
          }}
          sx={{
            mt: 2,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          View Repository
        </Button>
      </CardContent>
    </Card>
  );
}

export default RepositoryCard;
