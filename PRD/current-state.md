# Current State

## Product Snapshot

CAT Mock Lab is a static browser app for CAT-style mock test practice. It lets a learner start a bundled full-length mock, upload a custom JSON mock, answer MCQ and TITA questions, track section/question time, optionally mark confidence, submit the test, and review a question-level analysis report.

The product is frontend-only. There is no backend, build tool, package manager, authentication layer, database, or automated test suite in the current repo.

## Repository Shape

```text
.
+-- index.html
+-- Mocktest/
|   +-- app.js
|   +-- styles.css
|   +-- README.md
|   +-- question_set_generation_prompt.md
|   +-- sample-mocktests/
|   |   +-- created_sample_1.json
|   +-- previous-year-papers/
|       +-- previous_year_style_sample_1.json
+-- v2/
    +-- index.html
    +-- Mocktest/
        +-- duplicate copy of the same app assets and data
```

`index.html`, `Mocktest/app.js`, and `Mocktest/styles.css` are byte-for-byte duplicated under `v2/`. The duplicate copy creates ambiguity about the source of truth.

## User Experience Today

The first screen is the Practice dashboard. It shows saved attempt metrics from browser `localStorage`, presents bundled tests, and links to upload. Primary navigation currently exposes:

- Practice
- Upload
- History

There is also a `library-view` in the HTML and rendering logic for a library grid, but no visible navigation item routes users to it.

## Existing Capabilities

- Static GitHub Pages-compatible app served from repository root.
- Bundled full CAT-style mock JSON files.
- Upload flow for private custom JSON test files.
- Client-side validation for required test, section, passage, set, and question fields.
- Support for direct section questions and grouped resources through `passages`, `sets`, and `groups`.
- MCQ and TITA question rendering.
- Section timer and per-question visible timer.
- Question palette with answered, not answered, not visited, marked for review, and answered plus marked states.
- Section locking after moving ahead.
- On-screen calculator.
- Optional confidence/guess percentages for MCQ options.
- Score calculation using per-question positive and negative marks.
- Result filters by section, correctness, and insight type.
- Insights for confident attempts, guessed attempts, high-probability guesses, decision mismatches, unmarked likely guesses, and slow wrong answers.
- Attempt history persisted in browser `localStorage` under `catMockAttempts`.
- JSON report download.
- Browser print flow labeled as PDF generation.

## Bundled Content

The root app loads two bundled papers:

| File | Title | Sections | Questions |
| --- | --- | --- | --- |
| `Mocktest/sample-mocktests/created_sample_1.json` | CAT Full Mock - Actual Pattern 1 | VARC, DILR, QA | 66 |
| `Mocktest/previous-year-papers/previous_year_style_sample_1.json` | CAT Previous Year Style Sample 1 | VARC, DILR, QA | 66 |

Both papers currently use the same section counts:

| Section | Duration | Questions | Split |
| --- | ---: | ---: | --- |
| VARC | 40 min | 24 | 24 MCQ, 0 TITA |
| DILR | 40 min | 20 | 14 MCQ, 6 TITA |
| QA | 40 min | 22 | 13 MCQ, 9 TITA |

## Data Model Observed

At the root level, a test has:

- `id`
- `title`
- `description`
- `durationMinutes`
- `sections`

Each section has:

- `id`
- `name`
- `durationMinutes`
- `instruction`
- optional `passages`
- optional `sets`
- `questions` or `groups`

Each question has:

- `id`
- `type`: `mcq` or `tita`
- `text`
- `correctAnswer`
- `explanation`
- `marks`
- `negativeMarks`
- `topic`
- optional `options` for MCQ
- optional `passageId`, `setId`, `stimulusTitle`, or `stimulusText`

## Technical Notes

- The app is written in plain HTML, CSS, and JavaScript.
- The entry point is `index.html`, which loads `./Mocktest/styles.css` and `./Mocktest/app.js`.
- Sample paper JSON is fetched from `./Mocktest/sample-mocktests/created_sample_1.json` and `./Mocktest/previous-year-papers/previous_year_style_sample_1.json`.
- If fetching sample files fails, the app falls back to an embedded mini mock in `app.js`.
- The app should be served through a local static server, because direct `file://` opening can block JSON fetches.
- The calculator evaluates expressions through a constrained calculator UI, but the implementation uses dynamic function evaluation internally.
- The app uses browser APIs such as `structuredClone`, `FileReader`, `Blob`, `URL.createObjectURL`, `localStorage`, and `window.print`.

## Current Gaps And Risks

- Duplicate `v2/` copy creates maintenance risk and GitHub Pages confusion.
- No root `README.md` existed before this documentation pass, so GitHub visitors had limited project context.
- No formal PRD, roadmap, acceptance criteria, or task backlog existed.
- No automated validation script for uploaded or bundled mock JSON.
- No automated browser smoke tests for start, attempt, submit, and report flows.
- No linting, formatting, or CI.
- App state is held in one large JavaScript file, making future feature work harder to isolate.
- Uploaded tests are session-only and are not persisted across reloads.
- Attempt history stores only recent reports in `localStorage`; there is no export/import for all historical data.
- The UI label "Generate PDF" actually opens the browser print flow.
- The hidden library page is rendered but not reachable from current navigation.
- Current validation checks required fields but not all deeper quality constraints, such as duplicate question ids, MCQ answer letters, confidence totals before report, total question counts, and section count consistency.
- There is no accessibility audit for keyboard-only attempts, focus management, timer announcements, color contrast, or screen reader labels.
