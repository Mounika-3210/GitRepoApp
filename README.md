# Most Starred Repos

A React dashboard that discovers recently created, highly starred GitHub repositories and displays weekly repository activity.

## Features

- Last 1 week, 2 weeks, or 1 month
- Most-starred repository sorting
- Infinite scrolling
- Repository details
- Direct URL refresh support
- Stars, issues, forks, watchers
- Weekly activity for up to one year
- Commits, additions, deletions
- Total activity chart
- Contributor activity chart
- Contributor legend toggling
- Hover tooltips
- Responsive MUI UI
- Redux Toolkit state management
- Redux Saga API orchestration
- Highcharts visualization
- Session caching to reduce repeated GitHub requests
- Loading and error states

## Tech Stack

- React
- Vite
- Material UI
- Redux Toolkit
- Redux Saga
- Axios
- Highcharts

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite.

## Build

```bash
npm run build
```

## GitHub API note

The app uses GitHub's public REST API. Unauthenticated API usage is rate limited. During development, avoid repeatedly refreshing many repository detail pages.

Repository statistics can also return HTTP 202 while GitHub calculates them. The app polls the endpoint and caches successful responses in sessionStorage.
