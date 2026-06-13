# CAT Mock Lab

CAT Mock Lab is a static browser prototype for taking CAT-style mock tests. It includes sample tests, private JSON uploads, timed section attempts, optional confidence mapping, attempt history, result analysis, and downloadable JSON reports.

## Features

- Dashboard with attempt metrics, best score, average time per question, and confidence usage.
- Sample CAT mini mock covering VARC, DILR, and QA.
- JSON upload flow with validation before a custom test can start.
- Section timers and per-question timers.
- MCQ and TITA question support.
- Optional confidence mapping in 10% steps, tracked separately from the selected answer.
- Question palette with answered, review, and current states.
- Result page with score, accuracy, question-level review, insights, and report download.
- Attempt history saved in browser `localStorage`.

## Project Files

```text
Mocktest/
  index.html                         Main app markup
  styles.css                         App styling
  app.js                             App logic, sample test data, validation, timers, scoring
  question_set_generation_prompt.md  Prompt for generating upload-ready CAT test JSON
  created_sample_1.json              Example generated question set
```

## Run Locally

This is a plain HTML, CSS, and JavaScript app. No build step is required.

Open `index.html` directly in a browser:

```text
Mocktest/index.html
```

You can also serve the folder with any static file server if preferred.

## Using The App

1. Open the app.
2. Choose **Start a mock** or go to **Sample tests**.
3. Answer MCQ or TITA questions.
4. Optionally assign confidence values for answer choices.
5. Move through sections and submit the test.
6. Review the result analysis and download the JSON report if needed.

## Uploading A Custom Test

Use the **Upload JSON** screen to upload a complete test object. The uploaded file stays in the browser session and is validated before the test can start.

Expected root structure:

```json
{
  "title": "Test title",
  "description": "Short test description",
  "durationMinutes": 120,
  "sections": [
    {
      "id": "varc",
      "name": "VARC",
      "durationMinutes": 40,
      "questions": []
    }
  ]
}
```

Each question should include:

- `id`: unique question id
- `type`: `"mcq"` or `"tita"`
- `text`: question text
- `correctAnswer`: option letter for MCQ, exact answer string for TITA
- `explanation`: solution explanation
- `marks`: positive marks, usually `3`
- `negativeMarks`: negative marks, usually `-1` for MCQ and `0` for TITA
- `topic`: topic label
- `options`: required for MCQ questions

For generating upload-ready tests, use `question_set_generation_prompt.md`.

## Data Storage

Attempt history is stored in browser `localStorage` under:

```text
catMockAttempts
```

The app keeps the latest attempts for review. Clearing browser site data will remove saved history.

## Notes

- The app is a frontend-only prototype.
- Uploaded JSON files are not sent to a server.
- The downloadable result report is generated in the browser.
