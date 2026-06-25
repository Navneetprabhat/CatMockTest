# CAT Mock Lab

CAT Mock Lab is a static browser app for CAT-style mock test practice. It helps learners start a mock, answer MCQ and TITA questions in a timed attempt screen, submit the test, and review score, timing, confidence, and mistakes in one place.

The app runs entirely in the browser. Uploaded JSON files and attempt history stay local to the user's browser storage.

## Features

- CAT-style sections for VARC, DILR, and QA.
- Bundled full-length mock papers.
- Custom JSON upload with validation.
- MCQ and TITA question support.
- Section timer and per-question timer.
- Question palette with answered, not answered, not visited, review, and answered-review states.
- Optional confidence/guess tracking for MCQ choices.
- On-screen calculator.
- Result page with score, filters, insights, and question-level review.
- Attempt history saved in browser `localStorage`.
- JSON report download and browser print/save-PDF flow.

## Project Structure

```text
.
+-- index.html                         App entry point for GitHub Pages
+-- README.md                          GitHub-facing project guide
+-- PRD/
|   +-- current-state.md               Current repo and product analysis
|   +-- aligned-build.md               Product direction and alignment
|   +-- implementation-tasks.md        Prioritized implementation backlog
+-- Mocktest/
|   +-- app.js                         App logic, validation, timers, scoring, results
|   +-- styles.css                     App styling
|   +-- README.md                      Existing app notes
|   +-- question_set_generation_prompt.md
|   +-- sample-mocktests/
|   |   +-- created_sample_1.json
|   +-- previous-year-papers/
|       +-- previous_year_style_sample_1.json
+-- v2/                                Duplicate copy of the current app
```

## Run Locally

This project does not need a build step. Serve the repository root with any static server so the browser can fetch the bundled JSON files.

Using Python:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000/
```

Opening `index.html` directly can still show the embedded fallback mock, but local JSON fetches may be blocked by browser file restrictions.

## Using The App

1. Open the app in a browser.
2. Start one of the bundled mocks from the Practice screen, or upload your own JSON mock.
3. Answer MCQ or TITA questions.
4. Optionally use Guess to assign confidence percentages to MCQ options.
5. Move through sections and submit the test.
6. Review the result analysis and download the JSON report if needed.

## Custom Mock JSON

At minimum, a mock should follow this structure:

```json
{
  "id": "sample-cat-actual-pattern",
  "title": "CAT Full Mock - Actual Pattern",
  "description": "A full-length CAT-style mock.",
  "durationMinutes": 120,
  "sections": [
    {
      "id": "varc",
      "name": "VARC",
      "durationMinutes": 40,
      "instruction": "Read the question carefully and choose the best answer.",
      "questions": []
    }
  ]
}
```

Every question should include:

- `id`
- `type`: `mcq` or `tita`
- `text`
- `correctAnswer`
- `explanation`
- `marks`
- `negativeMarks`
- `topic`
- `options` for MCQ questions

VARC passages can be stored in a section-level `passages` array and referenced with `passageId`. DILR sets can be stored in a section-level `sets` array and referenced with `setId`.

For a detailed generation prompt, see `Mocktest/question_set_generation_prompt.md`.

## Product Planning

The PRD folder captures the repo analysis and next build direction:

- `PRD/current-state.md`
- `PRD/aligned-build.md`
- `PRD/implementation-tasks.md`

Start there before making larger feature changes.

## Notes For Contributors

- The root app is the practical GitHub Pages entry point.
- The `v2/` folder currently duplicates the root app and should be cleaned up or given a clear purpose before new feature work.
- The project currently has no package manager, build process, automated tests, or CI.
- Keep user data local unless a future PRD explicitly changes that product direction.
