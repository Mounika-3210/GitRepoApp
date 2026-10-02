import React, { useMemo } from "react";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import {
  getMetricLabel,
  getTotalActivity,
  getContributorSeries,
} from "../utils/statisticsUtils";

function ActivityCharts({
  metric,
  codeFrequency,
  commitActivity,
  contributors,
}) {
  const metricLabel =
    getMetricLabel(metric);

  const totalActivity = useMemo(
    () =>
      getTotalActivity(
        metric,
        codeFrequency,
        commitActivity
      ),
    [
      metric,
      codeFrequency,
      commitActivity,
    ]
  );

  const weekTimestamps = useMemo(
    () =>
      totalActivity.map(
        item => item[0]
      ),
    [totalActivity]
  );

  const contributorSeries = useMemo(
    () =>
      getContributorSeries(
        contributors,
        metric,
        weekTimestamps
      ),
    [
      contributors,
      metric,
      weekTimestamps,
    ]
  );

  const totalOptions = useMemo(
    () => ({
      chart: {
        type: "areaspline",
        height: 380,
        backgroundColor: "transparent",
        animation: {
          duration: 700,
        },
      },

      time: {
        useUTC: true,
      },

      title: {
        text: `Total ${metricLabel}`,
        align: "left",
      },

      subtitle: {
        text:
          "Weekly repository activity across all contributors",
        align: "left",
      },

      credits: {
        enabled: false,
      },

      accessibility: {
        enabled: false,
      },

      xAxis: {
        type: "datetime",
        tickInterval:
          7 * 24 * 60 * 60 * 1000,
        labels: {
          format:
            "{value:%b %d}",
        },
        crosshair: true,
      },

      yAxis: {
        min: 0,
        title: {
          text: metricLabel,
        },
      },

      tooltip: {
        shared: true,
        xDateFormat:
          "%A, %b %d, %Y",
      },

      plotOptions: {
        areaspline: {
          fillOpacity: 0.18,
          lineWidth: 3,
        },

        series: {
          animation: {
            duration: 700,
          },

          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
                radius: 5,
              },
            },
          },
        },
      },

      series: [
        {
          name: metricLabel,
          data: totalActivity,
        },
      ],
    }),
    [
      metricLabel,
      totalActivity,
    ]
  );

  const contributorOptions =
    useMemo(
      () => ({
        chart: {
          type: "spline",
          height: 520,
          backgroundColor:
            "transparent",
          animation: {
            duration: 700,
          },
        },

        time: {
          useUTC: true,
        },

        title: {
          text: `${metricLabel} by Contributor`,
          align: "left",
        },

        subtitle: {
          text:
            "Click a legend item to show or hide a contributor",
          align: "left",
        },

        credits: {
          enabled: false,
        },

        accessibility: {
          enabled: false,
        },

        xAxis: {
          type: "datetime",
          tickInterval:
            7 * 24 * 60 * 60 * 1000,
          labels: {
            format:
              "{value:%b %d}",
          },
          crosshair: true,
        },

        yAxis: {
          min: 0,
          title: {
            text: metricLabel,
          },
        },

        tooltip: {
          shared: false,
          xDateFormat:
            "%A, %b %d, %Y",
          pointFormat:
            "<b>{series.name}</b><br/>" +
            `${metricLabel}: <b>{point.y}</b>`,
        },

        legend: {
          enabled: true,
          layout: "horizontal",
          align: "center",
          verticalAlign: "bottom",
          maxHeight: 120,
          navigation: {
            enabled: true,
          },
        },

        plotOptions: {
          spline: {
            lineWidth: 2,
            marker: {
              enabled: false,
              states: {
                hover: {
                  enabled: true,
                  radius: 4,
                },
              },
            },
          },

          series: {
            animation: {
              duration: 700,
            },
          },
        },

        series: contributorSeries,
      }),
      [
        metricLabel,
        contributorSeries,
      ]
    );

  if (totalActivity.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: "center",
          border:
            "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={800}
        >
          No activity data available
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          GitHub did not return weekly data
          for this activity type.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, sm: 2 },
          borderRadius: 4,
          border:
            "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={totalOptions}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, sm: 2 },
          borderRadius: 4,
          border:
            "1px solid rgba(15,23,42,0.08)",
        }}
      >
        {contributorSeries.length > 0 ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={
              contributorOptions
            }
          />
        ) : (
          <Box
            sx={{
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 3,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                Contributor data unavailable
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                GitHub returned repository activity,
                but contributor statistics are not
                currently available.
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ActivityCharts;
