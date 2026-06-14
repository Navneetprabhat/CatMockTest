# CAT Actual-Pattern Mock JSON Generator Prompt

You are an expert CAT question setter and strict JSON formatter. Create one complete upload-ready JSON mock for the CAT Mock Lab app.

Return only raw JSON. Do not include markdown, comments, explanations outside JSON, or trailing commas.

Save generated sample mocks under `Mocktest/sample-mocktests/`. Save previous-year-style papers under `Mocktest/previous-year-papers/`.

## Required Paper Pattern

Generate exactly:

- VARC: 24 questions
- DILR: 20 questions
- QA: 22 questions
- Total: 66 questions
- Duration: 120 minutes
- Section duration: 40 minutes each
- Scoring: `marks` = `3`; MCQ `negativeMarks` = `-1`; TITA `negativeMarks` = `0`

## Required Root Structure

```json
{
  "id": "sample-cat-actual-pattern",
  "title": "CAT Full Mock - Actual Pattern",
  "description": "A full-length CAT-style mock with 24 VARC, 20 DILR, and 22 QA questions.",
  "durationMinutes": 120,
  "sections": []
}
```

## Required Sections

Create exactly three sections in this order:

```json
[
  {
    "id": "varc",
    "name": "VARC",
    "durationMinutes": 40,
    "instruction": "Read the question carefully and choose the best answer.",
    "passages": [],
    "questions": []
  },
  {
    "id": "dilr",
    "name": "DILR",
    "durationMinutes": 40,
    "instruction": "Study the data given on the left and answer the question.",
    "sets": [],
    "questions": []
  },
  {
    "id": "qa",
    "name": "QA",
    "durationMinutes": 40,
    "instruction": "Solve the question and choose the best answer. For TITA questions, type the exact answer.",
    "questions": []
  }
]
```

## VARC Structure

VARC must have 24 questions.

Use this mix unless asked otherwise:

- 4 reading comprehension passages
- 4 questions per passage, for 16 RC questions
- 8 verbal ability questions, such as para summary, para jumble, odd sentence, sentence completion, or vocabulary-in-context

Each passage must be stored once in `sections[0].passages`.

Passage object format:

```json
{
  "id": "varc-p1",
  "title": "Passage 1: Short Topic Title",
  "instruction": "The passage below is accompanied by four questions. Based on the passage, choose the best answer for each question.",
  "text": "Full passage text in plain text."
}
```

Each RC question must reference the passage:

```json
{
  "id": "v1",
  "type": "mcq",
  "passageId": "varc-p1",
  "text": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "A",
  "explanation": "Concise explanation.",
  "marks": 3,
  "negativeMarks": -1,
  "topic": "Reading Comprehension"
}
```

For non-RC VARC questions, do not use `passageId`. Include an `instruction` field that states the task.

## DILR Structure

DILR must have 20 questions.

Use 4 sets or caselets with 5 questions each unless asked otherwise.

Each set must be stored once in `sections[1].sets`.

Set object format:

```json
{
  "id": "dilr-s1",
  "title": "Set 1: Short Caselet Title",
  "instruction": "Study the data and answer the questions.",
  "text": "All required table, arrangement, route, schedule, or tournament data in plain text."
}
```

Each set-based question must reference the set:

```json
{
  "id": "d1",
  "type": "mcq",
  "setId": "dilr-s1",
  "text": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "B",
  "explanation": "Concise explanation.",
  "marks": 3,
  "negativeMarks": -1,
  "topic": "Data Interpretation"
}
```

Use a mix of MCQ and TITA. TITA questions must not include `options`.

## QA Structure

QA must have 22 questions.

Use a realistic mix from:

- Arithmetic
- Algebra
- Geometry
- Number system
- Modern math
- Time, speed and distance
- Time and work
- Profit and loss
- Percentages
- Ratio
- Averages
- Mixtures

Use both MCQ and TITA. TITA questions must not include `options`.

## Required Question Fields

Every question must include:

- `id`: unique string across the whole test
- `type`: `"mcq"` or `"tita"`
- `text`: question text in plain text
- `correctAnswer`: option letter for MCQ; exact typed answer string for TITA
- `explanation`: concise solution explanation
- `marks`: `3`
- `negativeMarks`: `-1` for MCQ and `0` for TITA
- `topic`: short topic label

For MCQ:

- Include exactly 4 options as strings in A, B, C, D order.
- `correctAnswer` must be `"A"`, `"B"`, `"C"`, or `"D"`.

For TITA:

- Do not include `options`.
- `correctAnswer` must be a string.
- Prefer integer or simple decimal answers.

## Style And Quality Rules

- Match CAT-style reasoning, not generic school-drill questions.
- Keep wording clear and exam-like.
- Do not use HTML, Markdown tables, images, or LaTeX.
- Use plain text math, such as `x^2 + y^2 = 25`.
- If a table is needed, write it plainly inside `text`.
- Ensure every question has exactly one correct answer.
- Make MCQ options plausible and close enough to require thought.
- Keep explanations accurate and short enough for post-test review.
- Double-check arithmetic, option mapping, and section counts.
- Keep every `passageId` and `setId` reference valid.

## Final Checklist

Before returning JSON, verify:

- The output is one valid JSON object.
- It has exactly 3 sections: VARC, DILR, QA.
- VARC has exactly 24 questions.
- DILR has exactly 20 questions.
- QA has exactly 22 questions.
- Total questions = 66.
- Duration = 120 minutes.
- Each section duration = 40 minutes.
- Every question id is unique.
- Every MCQ has exactly 4 options.
- Every TITA has no `options` field.
- Every RC question has a valid `passageId`.
- Every DILR set question has a valid `setId`.
- Every question includes `marks`, `negativeMarks`, and `topic`.
- The JSON can be parsed without edits.

Now generate the complete upload-ready JSON mock.
