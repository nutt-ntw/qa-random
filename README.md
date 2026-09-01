# QA Random — Lottery Draw Simulator

A responsive web application for simulating lottery draws and exploring the sampling distribution of the mean. It is designed as a classroom aid for learning about sampling and the Central Limit Theorem.

🔗 [Open the live application on GitHub Pages](https://nutt-ntw.github.io/qa-random/)

## Features

- Configure the number of tickets labeled 1 through 5
- Set the number of rounds and tickets drawn per round
- Draw without replacement within each round
- Automatically rebuild the ticket pool for every new round
- Calculate the mean for each round
- Visualize sample means as a dot plot with an estimated density curve
- Hover over a point to view its round number and mean
- Responsive layout for desktop and mobile devices
- Copy results in an Excel-friendly format
- Export results as CSV or Excel
- Show an exam countdown and a random quote after all rounds finish

## How to use

1. Set the number of tickets for each value.
2. Enter the number of draw rounds.
3. Enter the number of tickets to draw per round.
4. Select **🎲 Start Drawing**.
5. Review the latest result, history table, means, and sampling distribution.
6. Select **Reset** to clear all results and start over.

The default ticket configuration is:

| Value | Number of tickets |
|---:|---:|
| 1 | 5 |
| 2 | 3 |
| 3 | 1 |
| 4 | 3 |
| 5 | 5 |
| **Total** | **17** |

The population mean of the default configuration is 3.

## Randomization logic

At the beginning of each round, the application creates a ticket pool from the configured quantities. It chooses a random array position with `Math.random()` and removes the selected ticket from the pool with `splice()`.

This means:

- Multiple tickets within the same round are sampled **without replacement**.
- The full ticket pool is rebuilt before the next round begins.
- Draw rounds are independent of previous rounds.
- The probability of drawing each value is proportional to the number of its tickets.

> `Math.random()` is suitable for demonstrations and classroom experiments. It is not appropriate for secure, regulated, or auditable prize drawings.

## Central Limit Theorem experiments

To make the distribution of sample means easier to observe, try:

- Draw rounds: 50–100
- Tickets per round: 2–5
- Compare the shape and spread of the distribution as the sample size changes

Avoid drawing all 17 tickets per round with the default configuration. Selecting the entire population always produces a mean of 3, so the sampling distribution has zero variance.

The chart contains:

- **Orange dots:** the actual mean from each round
- **Blue curve:** an estimated density curve
- **Purple dashed line:** the overall mean across all rounds
- **X-axis:** round means on a fixed scale from 1 to 5

## Export format

CSV and Excel exports place each selected ticket in its own column and include:

- Round number
- Result 1, Result 2, …
- Mean
- Number of tickets drawn

## Run locally

This is a static web project with no package installation or build step.

Open `index.html` directly, or start a local server:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Technology

- HTML, CSS, and JavaScript
- Canvas API for chart rendering
- [SheetJS](https://sheetjs.com/) for Excel export
- Noto Sans Thai and Noto Sans
- GitHub Pages for hosting
