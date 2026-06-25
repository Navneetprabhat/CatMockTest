# Implementation Tasks

## P0 - Documentation And Repo Baseline

### TASK-001: Establish root project README

Status: Done in this documentation pass.

Acceptance criteria:

- Root `README.md` describes the app, features, run instructions, project files, JSON format, and contribution notes.
- README links to the PRD folder.

### TASK-002: Treat root app as the source of truth

Status: Not started.

Acceptance criteria:

- Decide whether `v2/` should be deleted, archived, or used for a real versioned deployment.
- Document the decision in README and PRD.
- Avoid future edits to duplicate copies unless a versioning strategy is intentional.

### TASK-003: Add bundled JSON validation command

Status: Not started.

Acceptance criteria:

- A script validates all JSON files in `Mocktest/sample-mocktests/` and `Mocktest/previous-year-papers/`.
- Validation checks parseability, section counts, question counts, duplicate ids, MCQ options, answer key shape, scoring fields, passage references, and set references.
- README documents how to run validation.

## P1 - Critical Product Flow

### TASK-004: Fix or expose the mocks library view

Status: Not started.

Acceptance criteria:

- Navigation includes a Mocks/Library item, or the unused `library-view` is removed.
- Bundled and uploaded tests are visible in one predictable place.
- Dashboard still supports fast start.

### TASK-005: Clarify PDF/report behavior

Status: Not started.

Acceptance criteria:

- If using browser print, button text says `Print / Save PDF`.
- If keeping `Generate PDF`, implement an actual generated file.
- README and UI use the same language.

### TASK-006: Add browser smoke test coverage

Status: Not started.

Acceptance criteria:

- Smoke test opens the app through a static server.
- Test starts a bundled mock, answers at least one MCQ and one TITA, moves sections, submits, and verifies result summary.
- Test verifies no uncaught console errors during the flow.

### TASK-007: Harden scoring and report generation

Status: Not started.

Acceptance criteria:

- Report generation handles missing response objects defensively.
- TITA normalization rules are documented and tested.
- Negative marking rules are validated per question type.
- Section-level score and accuracy summaries are available.

## P1 - Content And Validation

### TASK-008: Publish a JSON schema

Status: Not started.

Acceptance criteria:

- Add a documented schema for test JSON.
- Schema supports passages, sets, direct questions, groups, MCQ, and TITA.
- Upload validation and bundled validation follow the same rules.

### TASK-009: Improve upload validation feedback

Status: Not started.

Acceptance criteria:

- Errors are grouped by test, section, resource, and question.
- Duplicate ids and invalid answer keys are reported.
- The UI shows valid question counts by section.
- Start button is disabled until validation passes.

### TASK-010: Add content quality checklist

Status: Not started.

Acceptance criteria:

- Document checklist for new mock papers.
- Include CAT pattern counts, option plausibility, TITA format, explanation quality, and arithmetic verification.
- Link the checklist from README and the generator prompt.

## P2 - Learner Experience

### TASK-011: Improve attempt accessibility

Status: Not started.

Acceptance criteria:

- Keyboard users can move through answers, palette, calculator, and action buttons.
- Focus is placed predictably when switching questions and sections.
- Timers and validation errors have screen-reader-friendly labels.
- Color-coded states include text or aria labels.

### TASK-012: Add section-level result analysis

Status: Not started.

Acceptance criteria:

- Results include score, accuracy, time, attempts, and confidence usage per section.
- Filters can jump from a section summary to section questions.
- Downloaded JSON report includes section summaries.

### TASK-013: Add attempt history import/export

Status: Not started.

Acceptance criteria:

- Users can export all local attempt history.
- Users can import a previously exported history file.
- Imported data is validated before replacing or merging history.

### TASK-014: Persist uploaded mocks locally

Status: Not started.

Acceptance criteria:

- User can choose to save an uploaded mock in browser storage.
- Saved custom mocks appear after reload.
- User can delete saved custom mocks.
- Privacy copy explains data remains in the browser.

## P2 - Maintainability

### TASK-015: Split app logic into modules

Status: Not started.

Acceptance criteria:

- Separate modules for state, validation, rendering, attempt flow, results, storage, and utilities.
- No behavior regressions in manual smoke testing.
- If a build tool is introduced, README explains setup and GitHub Pages output.

### TASK-016: Add CI

Status: Not started.

Acceptance criteria:

- CI validates JSON fixtures.
- CI runs linting or formatting checks if tooling is added.
- CI runs browser smoke tests when practical.

### TASK-017: Replace dynamic calculator evaluation

Status: Not started.

Acceptance criteria:

- Calculator uses a small expression parser or safer operation model.
- Existing calculator buttons still work.
- Invalid expressions return `Error` without throwing.

## P3 - Future Enhancements

### TASK-018: Better question navigation analytics

Status: Not started.

Acceptance criteria:

- Report includes revisit count, changed answers, and time before final answer.
- Insights call out high time with answer changes and repeated visits.

### TASK-019: Add mock metadata and tagging

Status: Not started.

Acceptance criteria:

- Mocks can include source, difficulty, pattern year, author, and tags.
- Library supports filtering by metadata.

### TASK-020: Optional exam modes

Status: Not started.

Acceptance criteria:

- CAT remains the default mode.
- Any new mode declares section rules, scoring, and timing explicitly.
- Existing CAT mocks remain compatible.
