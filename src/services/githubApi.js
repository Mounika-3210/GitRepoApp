import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  timeout: 20000,
  headers: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

const CACHE_PREFIX = "gitrepo:";
const CACHE_MINUTES = 30;

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

const getCache = key => {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (Date.now() - parsed.timestamp > CACHE_MINUTES * 60 * 1000) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

const setCache = (key, data) => {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // Storage can be unavailable/full; API still works.
  }
};

const getStatisticsWithRetry = async (url, maxAttempts = 10) => {
  const cacheKey = `stats:${url}`;
  const cached = getCache(cacheKey);

  if (cached !== null) {
    console.log("Using cached statistics:", url);
    return cached;
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    console.log(
      `Statistics request ${attempt}/${maxAttempts}: ${url}`
    );

    try {
      const response = await githubApi.get(url);

      if (response.status === 200) {
        setCache(cacheKey, response.data);
        return response.data;
      }

      if (response.status === 202) {
        if (attempt === maxAttempts) {
          throw new Error(
            "GitHub is still calculating these statistics. Please try again later."
          );
        }

        const serverInterval =
          Number(response.headers["x-poll-interval"]) || 5;

        await sleep(Math.max(serverInterval, 5) * 1000);
        continue;
      }

      if (response.status === 204) {
        setCache(cacheKey, []);
        return [];
      }
    } catch (error) {
      const status = error.response?.status;

      if (status === 403) {
        const remaining =
          error.response?.headers?.["x-ratelimit-remaining"];

        const reset =
          error.response?.headers?.["x-ratelimit-reset"];

        if (remaining === "0" || remaining === 0) {
          const resetText = reset
            ? new Date(Number(reset) * 1000).toLocaleTimeString()
            : "later";

          const rateError = new Error(
            `GitHub API rate limit reached. The limit should reset around ${resetText}.`
          );

          rateError.code = "GITHUB_RATE_LIMIT";
          throw rateError;
        }

        throw error;
      }

      if (status === 404) throw error;

      if (status === 422) {
        throw error;
      }

      if (attempt === maxAttempts) throw error;

      await sleep(3000);
    }
  }

  return [];
};

export const searchRepositories = async (createdDate, page = 1) => {
  const cacheKey = `search:${createdDate}:${page}`;
  const cached = getCache(cacheKey);

  if (cached !== null) {
    return cached;
  }

  const response = await githubApi.get("/search/repositories", {
    params: {
      q: `created:>${createdDate}`,
      sort: "stars",
      order: "desc",
      page,
      per_page: 30,
    },
  });

  setCache(cacheKey, response.data);
  return response.data;
};

export const getCodeFrequency = (owner, repo) =>
  getStatisticsWithRetry(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo
    )}/stats/code_frequency`
  );

export const getCommitActivity = (owner, repo) =>
  getStatisticsWithRetry(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo
    )}/stats/commit_activity`
  );

export const getContributorsActivity = (owner, repo) =>
  getStatisticsWithRetry(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo
    )}/stats/contributors`
  );

export const getRepository = async (owner, repo) => {
  const cacheKey = `repo:${owner}:${repo}`;
  const cached = getCache(cacheKey);

  if (cached !== null) {
    return cached;
  }

  const response = await githubApi.get(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  );

  setCache(cacheKey, response.data);
  return response.data;
};

export default githubApi;
