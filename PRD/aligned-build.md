# What To Build And Alignment

## Product Vision

Build CAT Mock Lab into a reliable, GitHub Pages-friendly mock practice tool for learners who want a realistic attempt environment and a sharp post-test review loop without sending their data to a server.

The product should stay simple: upload or choose a mock, attempt it in a CAT-like interface, submit, then understand what to improve next.

## Target Users

- CAT aspirants taking self-practice mocks.
- Tutors or mentors creating JSON-based practice sets for students.
- Contributors maintaining sample papers and product features.

## Core User Jobs

- As a learner, I want to start a full mock quickly so I can practice without setup friction.
- As a learner, I want the attempt screen to feel close to CAT so my practice transfers to the exam.
- As a learner, I want timing and confidence insights so I can separate knowledge gaps from risk-taking mistakes.
- As a test creator, I want a clear JSON format and validation feedback so I can produce usable mocks.
- As a contributor, I want one source of truth, docs, and verification scripts so changes are easy to trust.

## Product Principles

- Privacy first: keep uploaded tests and attempt data local unless a future backend is explicitly introduced.
- Exam realism where it matters: timers, section locking, palette states, MCQ/TITA handling, and review status should match CAT-style behavior.
- Review over vanity metrics: the result page should help learners decide what to study next.
- Content quality is product quality: invalid or low-quality JSON should be caught early.
- Static-first delivery: the repo should remain easy to run locally and publish through GitHub Pages.

## Aligned Scope

### Keep

- Static HTML/CSS/JS deployment.
- Root `index.html` as the GitHub Pages entry point.
- JSON-based test content.
- Local-only upload and attempt history.
- CAT-style section structure: VARC, DILR, QA.
- MCQ and TITA support.
- Result analysis with filters and insight cards.

### Improve

- Make the root app the only maintained app copy or clearly document any versioned build strategy.
- Add a visible way to reach all available mocks, or remove the unused library view.
- Rename "Generate PDF" to "Print / Save PDF" or implement actual PDF generation.
- Add strict validation for bundled and uploaded mocks.
- Add a sample schema and small validation utility.
- Add browser smoke tests for the critical user flow.
- Split the large JavaScript file into maintainable modules if the project adopts a dev/build workflow.
- Improve accessibility and mobile attempt ergonomics.
- Persist uploaded mocks locally if that aligns with the privacy-first model.
- Add import/export for attempt history.

### Avoid For Now

- Backend accounts, sync, payments, leaderboards, or social features.
- Heavy frameworks unless there is a concrete need.
- Complex analytics that distract from the attempt-review loop.
- Server-side storage of uploaded tests.

## Desired Information Architecture

```text
Practice
+-- quick stats
+-- featured next mock
+-- recent attempt shortcut

Mocks
+-- bundled sample mocks
+-- previous-year-style mocks
+-- uploaded private mocks

Upload
+-- JSON format guide
+-- file picker
+-- strict validation output
+-- start button only when valid

Attempt
+-- section tabs
+-- timer
+-- passage/set panel
+-- question panel
+-- palette
+-- calculator

Results
+-- score summary
+-- section breakdown
+-- filters
+-- question review
+-- next-action insights

History
+-- saved attempts
+-- reopen report
+-- export/import history
```

## Success Metrics

- A new visitor can run the project locally within two minutes using the README.
- Bundled JSON validation passes with zero errors.
- A learner can start, answer, submit, and review a bundled mock without console errors.
- Attempt reports show accurate score, time, confidence, and section-level context.
- Contributors can identify the source of truth and modify the app without touching duplicate files.
- The critical flow works on desktop and mobile viewports.

## Non-Goals

- Replacing official CAT software.
- Guaranteeing question quality beyond local samples and validation checks.
- Hosting user data.
- Supporting every exam pattern outside CAT before the CAT flow is stable.

## Acceptance Criteria For The Next Product Baseline

- The repository has a single documented app entry point.
- Root README explains what the app is, how to run it, and where key files live.
- PRD documents exist for current state, aligned build direction, and implementation tasks.
- Bundled papers can be validated with a repeatable command.
- Navigation exposes all intended top-level views.
- The full start-to-submit-to-results flow passes a manual smoke test.
- The result export and print/PDF behavior are named accurately.
- No existing app capability is lost while cleanup work happens.
