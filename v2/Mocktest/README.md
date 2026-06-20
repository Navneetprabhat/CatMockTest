# CAT Mock Lab

CAT Mock Lab is a static browser prototype for focused CAT-style practice. It keeps the core loop simple: start a mock, attempt it without distractions, review the result, and upload a tighter custom set when needed.

## Features

- Practice desk with attempt metrics, best score, average time per question, and confidence usage.
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
index.html                           GitHub Pages entry point
Mocktest/
  sample-mocktests/
    created_sample_1.json            Full CAT-style sample mock
  previous-year-papers/
    previous_year_style_sample_1.json Previous-year-style sample paper
  styles.css                         App styling
  app.js                             App logic, sample test data, validation, timers, scoring
  question_set_generation_prompt.md  Focused prompt for generating upload-ready CAT test JSON
```

## Run Locally

This is a plain HTML, CSS, and JavaScript app. No build step is required.

Serve the repository root with a static server so the app can fetch sample paper JSON files:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000/
```

For GitHub Pages, publish from the repository root so GitHub Pages serves this root `index.html`. The page loads its CSS, JavaScript, and sample papers from the `Mocktest/` folder.

## Using The App

1. Open the app.
2. Start the sample mock from the **Practice** screen or upload your own JSON set.
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

For generating focused upload-ready tests, use `question_set_generation_prompt.md`.

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
