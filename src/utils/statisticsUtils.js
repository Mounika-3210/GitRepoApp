export const getMetricLabel = metric => {
  if (metric === "commits") return "Commits";
  if (metric === "additions") return "Additions";
  return "Deletions";
};

export const getContributorMetricValue = (week, metric) => {
  if (metric === "commits") return Number(week?.c) || 0;
  if (metric === "additions") return Number(week?.a) || 0;
  return Math.abs(Number(week?.d) || 0);
};

export const getTotalActivity = (
  metric,
  codeFrequency = [],
  commitActivity = []
) => {
  if (metric === "commits") {
    return commitActivity
      .filter(item => item && Number.isFinite(Number(item.week)))
      .map(item => [
        Number(item.week) * 1000,
        Number(item.total) || 0,
      ]);
  }

  if (metric === "additions") {
    return codeFrequency
      .filter(item => Array.isArray(item) && item.length >= 3)
      .map(item => [
        Number(item[0]) * 1000,
        Number(item[1]) || 0,
      ]);
  }

  return codeFrequency
    .filter(item => Array.isArray(item) && item.length >= 3)
    .map(item => [
      Number(item[0]) * 1000,
      Math.abs(Number(item[2]) || 0),
    ]);
};

export const getContributorSeries = (
  contributors = [],
  metric,
  weekTimestamps = []
) => {
  if (!Array.isArray(contributors)) return [];

  return contributors
    .filter(
      contributor =>
        contributor &&
        Array.isArray(contributor.weeks) &&
        contributor.weeks.length > 0
    )
    .map(contributor => {
      const weekMap = new Map();

      contributor.weeks.forEach(week => {
        if (Number.isFinite(Number(week.w))) {
          weekMap.set(Number(week.w) * 1000, week);
        }
      });

      return {
        name: contributor.author?.login || "Anonymous",
        data: weekTimestamps.map(timestamp => {
          const week = weekMap.get(timestamp);

          return [
            timestamp,
            week
              ? getContributorMetricValue(week, metric)
              : 0,
          ];
        }),
      };
    });
};

export const formatWeek = timestamp =>
  new Date(timestamp).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
