const fallbackSampleTests = [
  {
    id: "sample-cat-mini",
    title: "CAT Mini Mock 1",
    description: "A compact CAT-style mock covering VARC, DILR, and QA with realistic scoring rules.",
    durationMinutes: 30,
    sections: [
      {
        id: "varc",
        name: "VARC",
        durationMinutes: 10,
        questions: [
          {
            id: "v1",
            type: "mcq",
            text: "The author says a strong reading habit helps most when the passage is unfamiliar. Which option best captures the implication?",
            options: [
              "It removes the need to read the passage carefully.",
              "It helps the reader manage ambiguity and context.",
              "It guarantees correct answers in inference questions.",
              "It is useful only for literature-based passages."
            ],
            correctAnswer: "B",
            explanation: "The key idea is comfort with unfamiliar context, not guaranteed correctness.",
            marks: 3,
            negativeMarks: -1,
            topic: "Reading comprehension"
          },
          {
            id: "v2",
            type: "mcq",
            text: "Choose the sentence that best completes the paragraph: The team's failure was not caused by lack of effort; rather, it came from a refusal to revisit assumptions.",
            options: [
              "They worked harder than any previous group.",
              "More hours would therefore have solved the issue.",
              "Their problem was strategic rigidity, not energy.",
              "Assumptions are rarely important in planning."
            ],
            correctAnswer: "C",
            explanation: "The sentence restates the contrast between effort and assumptions.",
            marks: 3,
            negativeMarks: -1,
            topic: "Para completion"
          }
        ]
      },
      {
        id: "dilr",
        name: "DILR",
        durationMinutes: 10,
        questions: [
          {
            id: "d1",
            type: "mcq",
            text: "Four friends A, B, C, and D scored different marks. A scored more than B. C scored less than D. D scored less than A. Who cannot be the highest scorer?",
            options: ["A", "B", "C", "D"],
            correctAnswer: "B",
            explanation: "Since A scored more than B, B cannot be the highest.",
            marks: 3,
            negativeMarks: -1,
            topic: "Logical ordering"
          },
          {
            id: "d2",
            type: "tita",
            text: "A set has 5 red balls and 3 blue balls. If two balls are selected without replacement, how many ordered color outcomes are possible?",
            correctAnswer: "4",
            explanation: "RR, RB, BR, and BB are possible ordered color outcomes.",
            marks: 3,
            negativeMarks: 0,
            topic: "Counting"
          }
        ]
      },
      {
        id: "qa",
        name: "QA",
        durationMinutes: 10,
        questions: [
          {
            id: "q1",
            type: "mcq",
            text: "If x + 1/x = 5, what is x squared + 1/x squared?",
            options: ["23", "25", "27", "20"],
            correctAnswer: "A",
            explanation: "(x + 1/x)^2 = x^2 + 2 + 1/x^2, so the answer is 25 - 2 = 23.",
            marks: 3,
            negativeMarks: -1,
            topic: "Algebra"
          },
          {
            id: "q2",
            type: "tita",
            text: "A shopkeeper marks an item at Rs. 500 and gives a 20% discount. What is the selling price?",
            correctAnswer: "400",
            explanation: "20% of 500 is 100, so the selling price is 400.",
            marks: 3,
            negativeMarks: 0,
            topic: "Percentages"
          }
        ]
      }
    ]
  }
];

let sampleTests = fallbackSampleTests;

const samplePaperPaths = [
  { path: "./Mocktest/sample-mocktests/created_sample_1.json", source: "sample" },
  { path: "./Mocktest/previous-year-papers/previous_year_style_sample_1.json", source: "previous-year" }
];

const state = {
  activeView: "dashboard",
  uploadedTests: [],
  attempts: JSON.parse(localStorage.getItem("catMockAttempts") || "[]"),
  currentAttempt: null,
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  sectionStartedAt: null,
  questionStartedAt: null,
  timerId: null,
  latestReport: null,
  calculatorExpression: "",
  resultFilters: {
    subject: "all",
    correctness: "all",
    insight: "all"
  }
};

const els = {
  views: document.querySelectorAll(".view"),
  navItems: document.querySelectorAll(".nav-item"),
  featuredTest: document.getElementById("featured-test"),
  sampleTests: document.getElementById("sample-tests"),
  historyList: document.getElementById("history-list"),
  jsonUpload: document.getElementById("json-upload"),
  validationOutput: document.getElementById("validation-output"),
  loadTemplate: document.getElementById("load-template"),
  sectionTimer: document.getElementById("section-timer"),
  questionTimer: document.getElementById("question-timer"),
  sectionName: document.getElementById("section-name"),
  paletteSectionTitle: document.getElementById("palette-section-title"),
  questionPosition: document.getElementById("question-position"),
  questionType: document.getElementById("question-type"),
  questionInstruction: document.getElementById("question-instruction"),
  testLayout: document.getElementById("test-layout"),
  passageTitle: document.getElementById("passage-title"),
  passageText: document.getElementById("passage-text"),
  marksLine: document.getElementById("marks-line"),
  questionText: document.getElementById("question-text"),
  optionList: document.getElementById("option-list"),
  titaBox: document.getElementById("tita-box"),
  titaAnswer: document.getElementById("tita-answer"),
  confidencePanel: document.getElementById("confidence-panel"),
  confidenceControls: document.getElementById("confidence-controls"),
  confidenceTotal: document.getElementById("confidence-total"),
  clearConfidence: document.getElementById("clear-confidence"),
  clearResponse: document.getElementById("clear-response"),
  guessToggle: document.getElementById("guess-toggle"),
  toggleReview: document.getElementById("toggle-review"),
  saveNext: document.getElementById("save-next"),
  sectionTabs: document.getElementById("section-tabs"),
  questionPalette: document.getElementById("question-palette"),
  nextSection: document.getElementById("next-section"),
  submitTest: document.getElementById("submit-test"),
  resultTitle: document.getElementById("result-title"),
  resultSubtitle: document.getElementById("result-subtitle"),
  resultSummary: document.getElementById("result-summary"),
  questionReview: document.getElementById("question-review"),
  insightList: document.getElementById("insight-list"),
  downloadReport: document.getElementById("download-report"),
  downloadPdf: document.getElementById("download-pdf"),
  subjectFilter: document.getElementById("subject-filter"),
  correctnessFilter: document.getElementById("correctness-filter"),
  insightFilter: document.getElementById("insight-filter"),
  clearResultFilters: document.getElementById("clear-result-filters"),
  toast: document.getElementById("toast"),
  metricAttempts: document.getElementById("metric-attempts"),
  metricBest: document.getElementById("metric-best"),
  metricTime: document.getElementById("metric-time"),
  metricConfidence: document.getElementById("metric-confidence"),
  answeredCount: document.getElementById("answered-count"),
  notAnsweredCount: document.getElementById("not-answered-count"),
  notVisitedCount: document.getElementById("not-visited-count"),
  reviewCount: document.getElementById("review-count"),
  answeredReviewCount: document.getElementById("answered-review-count"),
  calculatorToggle: document.getElementById("calculator-toggle"),
  calculatorPanel: document.getElementById("calculator-panel"),
  calculatorClose: document.getElementById("calculator-close"),
  calculatorDisplay: document.getElementById("calculator-display")
};

async function init() {
  await loadSampleTests();
  renderDashboard();
  renderLibrary();
  renderHistory();
  bindEvents();
}

async function loadSampleTests() {
  try {
    const loadedSamples = [];
    for (const paper of samplePaperPaths) {
      const path = paper.path;
      const response = await fetch(path, { cache: "no-store" });
      if (!response.ok) continue;
      const sample = await response.json();
      const errors = validateTest(sample);
      if (errors.length) {
        console.warn(`${path} has validation errors:`, errors);
        continue;
      }
      sample.id = sample.id || `sample-${loadedSamples.length + 1}`;
      sample.source = paper.source;
      loadedSamples.push(sample);
    }
    if (loadedSamples.length) sampleTests = loadedSamples;
  } catch (error) {
    console.warn("Using embedded fallback sample because sample paper JSON could not be loaded.", error);
  }
}

function bindEvents() {
  els.navItems.forEach((item) => {
    item.addEventListener("click", () => showView(item.dataset.view));
  });

  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.viewTarget));
  });

  els.jsonUpload.addEventListener("change", handleUpload);
  els.loadTemplate.addEventListener("click", () => showValidation(sampleTests[0], []));
  els.clearResponse.addEventListener("click", clearResponse);
  els.guessToggle.addEventListener("click", toggleGuessPanel);
  els.toggleReview.addEventListener("click", toggleReview);
  els.saveNext.addEventListener("click", saveAndNext);
  els.nextSection.addEventListener("click", moveToNextSection);
  els.submitTest.addEventListener("click", submitAttempt);
  els.clearConfidence.addEventListener("click", clearConfidence);
  els.calculatorToggle.addEventListener("click", toggleCalculator);
  els.calculatorClose.addEventListener("click", () => els.calculatorPanel.classList.add("hidden"));
  els.calculatorPanel.querySelectorAll("[data-calc]").forEach((button) => {
    button.addEventListener("click", () => handleCalculatorInput(button.dataset.calc));
  });
  els.downloadReport.addEventListener("click", downloadReport);
  els.downloadPdf.addEventListener("click", printReport);
  els.subjectFilter.addEventListener("change", () => updateResultFilter("subject", els.subjectFilter.value));
  els.correctnessFilter.addEventListener("change", () => updateResultFilter("correctness", els.correctnessFilter.value));
  els.insightFilter.addEventListener("change", () => updateResultFilter("insight", els.insightFilter.value));
  els.clearResultFilters.addEventListener("click", clearResultFilters);
  els.titaAnswer.addEventListener("input", () => {
    getCurrentQuestionAttempt().answer = els.titaAnswer.value.trim();
    renderPalette();
    renderStatusCounts(getSectionQuestions(getCurrentSection()));
  });
}

function showView(name) {
  state.activeView = name;
  document.body.classList.toggle("in-attempt", name === "attempt");
  els.views.forEach((view) => view.classList.toggle("active", view.id === `${name}-view`));
  els.navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === name));
  if (name === "dashboard") renderDashboard();
  if (name === "history") renderHistory();
}

function renderDashboard() {
  const attempts = state.attempts;
  const best = attempts.length ? Math.max(...attempts.map((a) => a.score)) : 0;
  const totalQuestions = attempts.reduce((sum, a) => sum + a.questions.length, 0);
  const totalTime = attempts.reduce((sum, a) => sum + a.questions.reduce((qSum, q) => qSum + q.timeSpentSeconds, 0), 0);
  const confidenceCount = attempts.reduce((sum, a) => sum + a.questions.filter((q) => q.hasConfidence).length, 0);

  els.metricAttempts.textContent = attempts.length;
  els.metricBest.textContent = best;
  els.metricTime.textContent = totalQuestions ? `${Math.round(totalTime / totalQuestions)}s` : "0s";
  els.metricConfidence.textContent = totalQuestions ? `${Math.round((confidenceCount / totalQuestions) * 100)}%` : "0%";
  els.featuredTest.innerHTML = [...sampleTests, ...state.uploadedTests].map((test) => testCardMarkup(test, true)).join("");
  bindStartButtons();
}

function renderLibrary() {
  const allTests = [...sampleTests, ...state.uploadedTests];
  els.sampleTests.innerHTML = allTests.map((test) => testCardMarkup(test)).join("");
  bindStartButtons();
}

function testCardMarkup(test, wide = false) {
  const questions = countQuestions(test);
  const duration = test.sections.reduce((sum, section) => sum + section.durationMinutes, 0);
  const sourceLabels = {
    upload: "Private upload",
    sample: "Sample mocktest",
    "previous-year": "Previous year paper"
  };
  const source = sourceLabels[test.source] || "Sample mocktest";
  return `
    <article class="test-card ${wide ? "wide" : ""}">
      <span class="eyebrow">${source}</span>
      <h3>${escapeHtml(test.title)}</h3>
      <p>${escapeHtml(test.description || "CAT-style test with section timers and question analytics.")}</p>
      <div class="pill-row">
        <span class="pill">${test.sections.length} sections</span>
        <span class="pill">${questions} questions</span>
        <span class="pill">${duration} min</span>
      </div>
      <div class="test-actions" style="margin-top: 16px;">
        <button class="primary-action" data-start-test="${test.id}">Start test</button>
      </div>
    </article>
  `;
}

function bindStartButtons() {
  document.querySelectorAll("[data-start-test]").forEach((button) => {
    button.addEventListener("click", () => {
      const test = findTest(button.dataset.startTest);
      if (test) startAttempt(test);
    });
  });
}

function findTest(id) {
  return [...sampleTests, ...state.uploadedTests].find((test) => test.id === id);
}

function countQuestions(test) {
  return test.sections.reduce((sum, section) => sum + getSectionQuestions(section).length, 0);
}

function getSectionQuestions(section) {
  if (Array.isArray(section.questions)) return section.questions;
  if (!Array.isArray(section.groups)) return [];
  return section.groups.flatMap((group) => Array.isArray(group.questions) ? group.questions : []);
}

function getQuestionResource(section, question) {
  const passage = question.passageId && Array.isArray(section.passages)
    ? section.passages.find((item) => item.id === question.passageId)
    : null;
  const set = question.setId && Array.isArray(section.sets)
    ? section.sets.find((item) => item.id === question.setId)
    : null;
  const resource = passage || set || null;
  return {
    title: question.stimulusTitle || resource?.title || "",
    text: question.stimulusText || resource?.text || "",
    instruction: question.instruction || resource?.instruction || section.instruction || "Read the question and choose the best answer."
  };
}

function getOptionText(option) {
  return typeof option === "string" ? option : option?.text || "";
}

function handleUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const errors = validateTest(parsed);
      if (!errors.length) {
        parsed.id = `upload-${Date.now()}`;
        parsed.source = "upload";
        state.uploadedTests.push(parsed);
        renderLibrary();
      }
      showValidation(parsed, errors);
    } catch (error) {
      els.validationOutput.classList.add("empty-state");
      els.validationOutput.innerHTML = `<div class="empty-state">Invalid JSON: ${escapeHtml(error.message)}</div>`;
    }
  };
  reader.readAsText(file);
}

function validateTest(test) {
  const errors = [];
  if (!test.title) errors.push("Missing test title.");
  if (!Array.isArray(test.sections) || !test.sections.length) {
    errors.push("Test must include at least one section.");
    return errors;
  }

  test.sections.forEach((section, sectionIndex) => {
    if (!section.name) errors.push(`Section ${sectionIndex + 1} is missing a name.`);
    if (!section.durationMinutes) errors.push(`${section.name || `Section ${sectionIndex + 1}`} is missing durationMinutes.`);
    const questions = getSectionQuestions(section);
    if (!questions.length) {
      errors.push(`${section.name || `Section ${sectionIndex + 1}`} must include questions.`);
      return;
    }

    if (Array.isArray(section.passages)) {
      section.passages.forEach((passage, passageIndex) => {
        if (!passage.id) errors.push(`${section.name || "Section"} passage ${passageIndex + 1} is missing id.`);
        if (!passage.text) errors.push(`${section.name || "Section"} passage ${passageIndex + 1} is missing text.`);
      });
    }

    if (Array.isArray(section.sets)) {
      section.sets.forEach((set, setIndex) => {
        if (!set.id) errors.push(`${section.name || "Section"} set ${setIndex + 1} is missing id.`);
        if (!set.text) errors.push(`${section.name || "Section"} set ${setIndex + 1} is missing text.`);
      });
    }

    questions.forEach((question, questionIndex) => {
      const label = `${section.name || "Section"} Q${questionIndex + 1}`;
      if (!question.text) errors.push(`${label} is missing text.`);
      if (!["mcq", "tita"].includes(question.type)) errors.push(`${label} has unsupported type.`);
      if (question.type === "mcq" && (!Array.isArray(question.options) || question.options.length !== 4)) errors.push(`${label} needs exactly four options.`);
      if (question.correctAnswer === undefined) errors.push(`${label} is missing correctAnswer.`);
      if (question.marks === undefined) errors.push(`${label} is missing marks.`);
      if (question.negativeMarks === undefined) errors.push(`${label} is missing negativeMarks.`);
      if (question.passageId && !section.passages?.some((passage) => passage.id === question.passageId)) errors.push(`${label} references an unknown passageId.`);
      if (question.setId && !section.sets?.some((set) => set.id === question.setId)) errors.push(`${label} references an unknown setId.`);
    });
  });
  return errors;
}

function showValidation(test, errors) {
  if (errors.length) {
    els.validationOutput.classList.add("empty-state");
    els.validationOutput.innerHTML = `
      <div class="empty-state">
        <strong>Needs fixes</strong>
        <ul>${errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>
      </div>
    `;
    return;
  }
  els.validationOutput.classList.remove("empty-state");
  els.validationOutput.innerHTML = `
    <div class="test-card wide">
      <span class="eyebrow">Ready</span>
      <h3>${escapeHtml(test.title)}</h3>
      <p>${countQuestions(test)} questions across ${test.sections.length} sections. Negative marking and timers are configured.</p>
      <div class="pill-row">
        ${test.sections.map((section) => `<span class="pill">${escapeHtml(section.name)}: ${section.durationMinutes} min</span>`).join("")}
      </div>
      <div class="test-actions" style="margin-top: 16px;">
        <button class="primary-action" data-start-test="${test.id || sampleTests[0].id}">Start test</button>
      </div>
    </div>
  `;
  bindStartButtons();
}

function startAttempt(test) {
  state.currentAttempt = {
    id: `attempt-${Date.now()}`,
    test: structuredClone(test),
    startedAt: new Date().toISOString(),
    lockedSections: [],
    responses: {}
  };
  state.currentSectionIndex = 0;
  state.currentQuestionIndex = 0;
  state.sectionStartedAt = Date.now();
  state.questionStartedAt = Date.now();
  buildResponseShell(test);
  showView("attempt");
  startTimer();
  renderAttempt();
}

function buildResponseShell(test) {
  test.sections.forEach((section) => {
    getSectionQuestions(section).forEach((question) => {
      state.currentAttempt.responses[question.id] = {
        answer: "",
        confidence: {},
        hasConfidence: false,
        showGuess: false,
        markedForReview: false,
        timeSpentSeconds: 0,
        visits: 0
      };
    });
  });
}

function startTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    if (!state.currentAttempt) return;
    const remaining = getSectionRemainingSeconds();
    if (remaining <= 0) {
      moveToNextSection(true);
      return;
    }
    renderTimers();
  }, 1000);
}

function getCurrentSection() {
  return state.currentAttempt.test.sections[state.currentSectionIndex];
}

function getCurrentQuestion() {
  return getSectionQuestions(getCurrentSection())[state.currentQuestionIndex];
}

function getCurrentQuestionAttempt() {
  return state.currentAttempt.responses[getCurrentQuestion().id];
}

function renderAttempt(recordVisit = true) {
  const test = state.currentAttempt.test;
  const section = getCurrentSection();
  const questions = getSectionQuestions(section);
  const question = getCurrentQuestion();
  const response = getCurrentQuestionAttempt();
  const resource = getQuestionResource(section, question);
  if (recordVisit) response.visits += 1;

  els.sectionName.textContent = section.name;
  els.paletteSectionTitle.textContent = section.name;
  els.questionPosition.textContent = `Question No. ${state.currentQuestionIndex + 1}`;
  els.questionType.textContent = question.type.toUpperCase();
  els.questionText.textContent = question.text;
  els.questionInstruction.textContent = resource.instruction;
  els.passageTitle.textContent = resource.title;
  els.passageText.textContent = resource.text;
  els.testLayout.classList.toggle("question-only", !hasQuestionResource(resource));
  els.marksLine.textContent = `Marks for correct answer: ${question.marks} | Negative Marks: ${Math.abs(question.negativeMarks)}`;
  els.toggleReview.textContent = "Mark for Review & Next";
  updateSectionActions();

  if (question.type === "mcq") {
    els.optionList.classList.remove("hidden");
    els.titaBox.classList.add("hidden");
    els.guessToggle.classList.remove("hidden");
    els.confidencePanel.classList.toggle("hidden", !response.showGuess);
    renderOptions(question, response);
    if (response.showGuess) renderConfidence(question, response);
  } else {
    els.optionList.classList.add("hidden");
    els.titaBox.classList.remove("hidden");
    els.confidencePanel.classList.add("hidden");
    els.guessToggle.classList.add("hidden");
    els.titaAnswer.value = response.answer || "";
  }

  renderTabs();
  renderPalette();
  renderStatusCounts(questions);
  renderTimers();
}

function hasQuestionResource(resource) {
  return Boolean(resource.title || resource.text);
}

function updateSectionActions() {
  const isFinalSection = state.currentSectionIndex === state.currentAttempt.test.sections.length - 1;
  els.nextSection.classList.toggle("hidden", isFinalSection);
  els.submitTest.classList.toggle("hidden", !isFinalSection);
}

function renderOptions(question, response) {
  els.optionList.innerHTML = question.options.map((option, index) => {
    const key = optionKey(index);
    const selected = response.answer === key;
    return `
      <label class="option-card ${selected ? "selected" : ""}">
        <input type="radio" name="answer" value="${key}" ${selected ? "checked" : ""} />
        <span>${escapeHtml(getOptionText(option))}</span>
      </label>
    `;
  }).join("");

  els.optionList.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      response.answer = input.value;
      renderOptions(question, response);
      renderPalette();
      renderStatusCounts(getSectionQuestions(getCurrentSection()));
    });
  });
}

function renderConfidence(question, response) {
  els.confidenceControls.innerHTML = question.options.map((option, index) => {
    const key = optionKey(index);
    const value = response.confidence[key] ?? "";
    return `
      <label class="confidence-row">
        <span>${key}. ${escapeHtml(getOptionText(option))}</span>
        <input type="number" min="0" max="100" step="1" value="${value}" data-confidence="${key}" placeholder="0" />
        <strong>%</strong>
      </label>
    `;
  }).join("");

  els.confidenceControls.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const key = input.dataset.confidence;
      const value = input.value.trim();
      if (value === "") delete response.confidence[key];
      else response.confidence[key] = clampPercent(value);
      if (value !== "") input.value = response.confidence[key];
      response.hasConfidence = confidenceTotal(response) > 0;
      updateConfidenceTotal(response);
    });
  });
  updateConfidenceTotal(response);
}

function confidenceTotal(response) {
  return Object.values(response.confidence).reduce((sum, value) => sum + Number(value || 0), 0);
}

function clampPercent(value) {
  const numeric = Math.round(Number(value));
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(100, Math.max(0, numeric));
}

function normalizeGuessPercentages(question, response) {
  const keys = question.options.map((option, index) => optionKey(index));
  const values = keys.map((key) => clampPercent(response.confidence[key] || 0));
  const total = values.reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    response.confidence = {};
    response.hasConfidence = false;
    return;
  }

  let normalized = values;
  if (total > 100) {
    const scaled = values.map((value) => (value / total) * 100);
    normalized = scaled.map((value) => Math.floor(value));
    distributeRemainder(normalized, 100 - normalized.reduce((sum, value) => sum + value, 0), scaled);
  } else if (total < 100) {
    const blankIndexes = keys
      .map((key, index) => response.confidence[key] === undefined ? index : -1)
      .filter((index) => index >= 0);
    const zeroIndexes = values
      .map((value, index) => value === 0 ? index : -1)
      .filter((index) => index >= 0);
    const targetIndexes = blankIndexes.length ? blankIndexes : zeroIndexes.length ? zeroIndexes : keys.map((key, index) => index);
    normalized = [...values];
    distributeEvenly(normalized, 100 - total, targetIndexes);
  }

  response.confidence = keys.reduce((confidence, key, index) => {
    confidence[key] = normalized[index];
    return confidence;
  }, {});
  response.hasConfidence = true;
}

function distributeRemainder(values, remainder, rawValues) {
  const order = rawValues
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);
  for (let i = 0; i < remainder; i += 1) {
    values[order[i % order.length].index] += 1;
  }
}

function distributeEvenly(values, remainder, indexes) {
  indexes.forEach((index, offset) => {
    const base = Math.floor(remainder / indexes.length);
    const extra = offset < remainder % indexes.length ? 1 : 0;
    values[index] += base + extra;
  });
}

function updateConfidenceTotal(response) {
  const total = confidenceTotal(response);
  els.confidenceTotal.textContent = `Entered total: ${total}%`;
  els.confidenceTotal.classList.toggle("invalid", response.hasConfidence && total > 100);
}

function clearConfidence() {
  const response = getCurrentQuestionAttempt();
  response.confidence = {};
  response.hasConfidence = false;
  response.showGuess = false;
  renderAttemptPreserveTime();
}

function toggleGuessPanel() {
  const question = getCurrentQuestion();
  if (question.type !== "mcq") return;
  const response = getCurrentQuestionAttempt();
  response.showGuess = !response.showGuess;
  renderAttemptPreserveTime();
}

function toggleCalculator() {
  els.calculatorPanel.classList.toggle("hidden");
  updateCalculatorDisplay();
}

function handleCalculatorInput(value) {
  if (value === "clear") {
    state.calculatorExpression = "";
  } else if (value === "back") {
    state.calculatorExpression = state.calculatorExpression.slice(0, -1);
  } else if (value === "equals") {
    state.calculatorExpression = calculateExpression(state.calculatorExpression);
  } else if (value === "%") {
    const result = calculateExpression(state.calculatorExpression);
    state.calculatorExpression = result === "Error" ? result : String(Number(result) / 100);
  } else {
    if (state.calculatorExpression === "Error") state.calculatorExpression = "";
    state.calculatorExpression += value;
  }
  updateCalculatorDisplay();
}

function calculateExpression(expression) {
  const trimmed = expression.trim();
  if (!trimmed || !/^[0-9+\-*/().\s]+$/.test(trimmed)) return "Error";
  try {
    const result = Function(`"use strict"; return (${trimmed})`)();
    return Number.isFinite(result) ? String(Number(result.toFixed(8))) : "Error";
  } catch (error) {
    return "Error";
  }
}

function updateCalculatorDisplay() {
  els.calculatorDisplay.value = state.calculatorExpression || "0";
}

function renderTabs() {
  const locked = state.currentAttempt.lockedSections;
  els.sectionTabs.innerHTML = state.currentAttempt.test.sections.map((section, index) => {
    const isLocked = locked.includes(index);
    return `
      <button class="section-tab ${index === state.currentSectionIndex ? "active" : ""} ${isLocked ? "locked" : ""}" data-section="${index}" ${isLocked ? "disabled" : ""}>
        ${escapeHtml(section.name)}
      </button>
    `;
  }).join("");

  els.sectionTabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const target = Number(button.dataset.section);
      if (target === state.currentSectionIndex || target < state.currentSectionIndex) return;
      moveToSection(target);
    });
  });
}

function renderPalette() {
  const section = getCurrentSection();
  const questions = getSectionQuestions(section);
  els.questionPalette.innerHTML = questions.map((question, index) => {
    const response = state.currentAttempt.responses[question.id];
    const classes = ["palette-button", getPaletteState(response)].join(" ");
    return `<button class="${classes}" data-question="${index}">${index + 1}</button>`;
  }).join("");

  els.questionPalette.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      switchQuestion(Number(button.dataset.question));
    });
  });
}

function getPaletteState(response) {
  if (response.answer && response.markedForReview) return "answered-review";
  if (response.markedForReview) return "review";
  if (response.answer) return "answered";
  if (response.visits > 0) return "not-answered";
  return "not-visited";
}

function renderStatusCounts(questions) {
  const counts = {
    answered: 0,
    notAnswered: 0,
    notVisited: 0,
    review: 0,
    answeredReview: 0
  };

  questions.forEach((question, index) => {
    const response = state.currentAttempt.responses[question.id];
    const stateName = getPaletteState(response);
    if (stateName === "answered") counts.answered += 1;
    if (stateName === "not-answered") counts.notAnswered += 1;
    if (stateName === "not-visited") counts.notVisited += 1;
    if (stateName === "review") counts.review += 1;
    if (stateName === "answered-review") counts.answeredReview += 1;
  });

  els.answeredCount.textContent = counts.answered;
  els.notAnsweredCount.textContent = counts.notAnswered;
  els.notVisitedCount.textContent = counts.notVisited;
  els.reviewCount.textContent = counts.review;
  els.answeredReviewCount.textContent = counts.answeredReview;
}

function renderTimers() {
  els.sectionTimer.textContent = formatTime(Math.max(0, getSectionRemainingSeconds()));
  els.questionTimer.textContent = `${getCurrentVisibleQuestionSeconds()}s`;
}

function getSectionRemainingSeconds() {
  const section = getCurrentSection();
  const total = section.durationMinutes * 60;
  const elapsed = Math.floor((Date.now() - state.sectionStartedAt) / 1000);
  return total - elapsed;
}

function getCurrentVisibleQuestionSeconds() {
  const response = getCurrentQuestionAttempt();
  const activeVisitSeconds = Math.floor((Date.now() - state.questionStartedAt) / 1000);
  return response.timeSpentSeconds + Math.max(0, activeVisitSeconds);
}

function switchQuestion(index) {
  commitQuestionTime();
  state.currentQuestionIndex = index;
  state.questionStartedAt = Date.now();
  renderAttempt();
}

function renderAttemptPreserveTime() {
  renderAttempt(false);
}

function commitQuestionTime() {
  if (!state.currentAttempt || !state.questionStartedAt) return;
  const response = getCurrentQuestionAttempt();
  response.timeSpentSeconds += Math.max(0, Math.floor((Date.now() - state.questionStartedAt) / 1000));
  state.questionStartedAt = Date.now();
}

function clearResponse() {
  const response = getCurrentQuestionAttempt();
  response.answer = "";
  renderAttemptPreserveTime();
}

function toggleReview() {
  const response = getCurrentQuestionAttempt();
  response.markedForReview = true;
  saveAndNext();
}

function saveAndNext() {
  const response = getCurrentQuestionAttempt();
  const question = getCurrentQuestion();
  if (response.hasConfidence && question.type === "mcq") {
    normalizeGuessPercentages(question, response);
  }

  const section = getCurrentSection();
  const questions = getSectionQuestions(section);
  if (state.currentQuestionIndex < questions.length - 1) {
    switchQuestion(state.currentQuestionIndex + 1);
  } else {
    moveToNextSection();
  }
}

function moveToNextSection(auto = false) {
  const nextIndex = state.currentSectionIndex + 1;
  if (nextIndex >= state.currentAttempt.test.sections.length) {
    if (auto) submitAttempt();
    else showToast("This is the final section. Submit when ready.");
    return;
  }
  moveToSection(nextIndex);
}

function moveToSection(index) {
  commitQuestionTime();
  state.currentAttempt.lockedSections.push(state.currentSectionIndex);
  state.currentSectionIndex = index;
  state.currentQuestionIndex = 0;
  state.sectionStartedAt = Date.now();
  state.questionStartedAt = Date.now();
  renderAttempt();
}

function submitAttempt() {
  if (!state.currentAttempt) return;
  commitQuestionTime();
  clearInterval(state.timerId);
  const report = buildReport();
  state.latestReport = report;
  state.attempts.unshift(report);
  localStorage.setItem("catMockAttempts", JSON.stringify(state.attempts.slice(0, 12)));
  state.currentAttempt = null;
  renderResults(report);
  showView("results");
}

function buildReport() {
  const attempt = state.currentAttempt;
  const questions = [];
  let score = 0;
  let correct = 0;
  let incorrect = 0;
  let unattempted = 0;

  attempt.test.sections.forEach((section) => {
    getSectionQuestions(section).forEach((question) => {
      const response = attempt.responses[question.id];
      const isAttempted = Boolean(response.answer);
      const isCorrect = isAttempted && normalize(response.answer) === normalize(question.correctAnswer);
      const marks = !isAttempted ? 0 : isCorrect ? question.marks : question.negativeMarks;
      score += marks;
      if (!isAttempted) unattempted += 1;
      else if (isCorrect) correct += 1;
      else incorrect += 1;
      const confidenceOnSelected = response.hasConfidence && response.answer ? Number(response.confidence[response.answer] || 0) : null;
      const confidenceOnCorrect = response.hasConfidence ? Number(response.confidence[question.correctAnswer] || 0) : null;
      const highestOption = response.hasConfidence ? highestConfidenceOption(response.confidence) : null;
      const decisionMismatch = Boolean(response.hasConfidence && highestOption && response.answer && highestOption !== response.answer);
      const guessedAttempt = Boolean(isAttempted && response.hasConfidence);
      const highProbabilityGuess = guessedAttempt && confidenceOnSelected >= 70;
      const confidentAttempt = Boolean(isAttempted && (!response.hasConfidence || confidenceOnSelected >= 70));
      const unmarkedLikelyGuess = Boolean(isAttempted && !response.hasConfidence && !isCorrect);

      questions.push({
        questionNumber: questions.length + 1,
        section: section.name,
        questionId: question.id,
        question: question.text,
        sourceTitle: getQuestionResource(section, question).title,
        type: question.type,
        selectedAnswer: response.answer || null,
        correctAnswer: question.correctAnswer,
        isCorrect,
        isAttempted,
        marks,
        confidence: response.hasConfidence ? response.confidence : null,
        hasConfidence: response.hasConfidence,
        confidenceOnSelected,
        confidenceOnCorrect,
        highestConfidenceOption: highestOption,
        decisionMismatch,
        guessedAttempt,
        highProbabilityGuess,
        confidentAttempt,
        unmarkedLikelyGuess,
        timeSpentSeconds: response.timeSpentSeconds,
        visits: response.visits,
        markedForReview: response.markedForReview,
        explanation: question.explanation || "",
        topic: question.topic || ""
      });
    });
  });

  return {
    id: attempt.id,
    testTitle: attempt.test.title,
    startedAt: attempt.startedAt,
    submittedAt: new Date().toISOString(),
    score,
    correct,
    incorrect,
    unattempted,
    totalQuestions: questions.length,
    questions
  };
}

function renderResults(report) {
  state.resultFilters = { subject: "all", correctness: "all", insight: "all" };
  const accuracy = report.totalQuestions ? Math.round((report.correct / report.totalQuestions) * 100) : 0;
  const attempted = report.correct + report.incorrect;
  const avgTime = report.totalQuestions ? Math.round(report.questions.reduce((sum, q) => sum + q.timeSpentSeconds, 0) / report.totalQuestions) : 0;

  els.resultTitle.textContent = report.testTitle;
  els.resultSubtitle.textContent = `${attempted} attempted, ${report.unattempted} unattempted, ${accuracy}% accuracy across all questions.`;
  els.resultSummary.innerHTML = `
    ${metricMarkup("Score", report.score)}
    ${metricMarkup("Correct", report.correct)}
    ${metricMarkup("Incorrect", report.incorrect)}
    ${metricMarkup("Avg time", `${avgTime}s`)}
  `;
  renderResultFilters(report);
  renderQuestionReview(report);
  renderInsights(report, avgTime);
  renderHistory();
}

function renderQuestionReview(report) {
  const questions = getFilteredReportQuestions(report);
  if (!questions.length) {
    els.questionReview.innerHTML = `<div class="empty-state">No questions match the selected filters.</div>`;
    return;
  }

  els.questionReview.innerHTML = questions.map((q, index) => {
    const status = !q.isAttempted ? "Unattempted" : q.isCorrect ? "Correct" : "Incorrect";
    const statusClass = q.isCorrect ? "status-good" : q.isAttempted ? "status-bad" : "";
    const mismatch = isDecisionMismatch(q);
    const questionNumber = q.questionNumber || report.questions.indexOf(q) + 1 || index + 1;
    return `
      <article class="review-card">
        <div class="review-meta">
          <span>Q${questionNumber}</span>
          <span>${escapeHtml(q.section)}</span>
          ${q.topic ? `<span>${escapeHtml(q.topic)}</span>` : ""}
          <span>${q.timeSpentSeconds}s</span>
          <span>${q.visits} visits</span>
          <span class="${statusClass}">${status}</span>
          ${isGuessedAttempt(q) ? "<span>Guess used</span>" : ""}
          ${isHighProbabilityGuess(q) ? "<span>70%+ guess</span>" : ""}
          ${q.markedForReview ? "<span>Marked for review</span>" : ""}
        </div>
        <h3>${escapeHtml(q.question)}</h3>
        <p>Selected: <strong>${escapeHtml(q.selectedAnswer || "None")}</strong> | Correct: <strong>${escapeHtml(String(q.correctAnswer))}</strong> | Marks: <strong>${q.marks}</strong></p>
        ${q.hasConfidence ? `<p>Guess on selected: <strong>${q.confidenceOnSelected}%</strong> | Guess on correct: <strong>${q.confidenceOnCorrect}%</strong> | Highest % option: <strong>${q.highestConfidenceOption}</strong></p>` : "<p>No Guess percentage provided.</p>"}
        ${mismatch ? "<p><strong>Decision mismatch:</strong> selected answer differs from highest % option.</p>" : ""}
        ${isUnmarkedLikelyGuess(q) ? "<p><strong>Unmarked likely guess:</strong> wrong answer without a Guess percentage. Mark these next time if you were unsure.</p>" : ""}
        ${q.explanation ? `<p>${escapeHtml(q.explanation)}</p>` : ""}
      </article>
    `;
  }).join("");
}

function metricMarkup(label, value) {
  return `<article class="metric-card"><span>${label}</span><strong>${value}</strong></article>`;
}

function renderResultFilters(report) {
  const subjects = [...new Set(report.questions.map((q) => q.section))];
  els.subjectFilter.innerHTML = [
    `<option value="all">All subjects</option>`,
    ...subjects.map((subject) => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`)
  ].join("");
  els.subjectFilter.value = subjects.includes(state.resultFilters.subject) ? state.resultFilters.subject : "all";
  els.correctnessFilter.value = state.resultFilters.correctness;
  els.insightFilter.value = state.resultFilters.insight;
}

function updateResultFilter(key, value) {
  state.resultFilters[key] = value;
  if (!state.latestReport) return;
  renderQuestionReview(state.latestReport);
}

function clearResultFilters() {
  state.resultFilters = { subject: "all", correctness: "all", insight: "all" };
  if (!state.latestReport) return;
  renderResultFilters(state.latestReport);
  renderQuestionReview(state.latestReport);
}

function getFilteredReportQuestions(report) {
  return report.questions.filter((question) => {
    if (state.resultFilters.subject !== "all" && question.section !== state.resultFilters.subject) return false;
    if (!matchesCorrectnessFilter(question, state.resultFilters.correctness)) return false;
    if (!matchesInsightFilter(question, state.resultFilters.insight)) return false;
    return true;
  });
}

function matchesCorrectnessFilter(question, filter) {
  if (filter === "all") return true;
  if (filter === "correct") return question.isAttempted && question.isCorrect;
  if (filter === "incorrect") return question.isAttempted && !question.isCorrect;
  if (filter === "unattempted") return !question.isAttempted;
  return true;
}

function matchesInsightFilter(question, filter) {
  if (filter === "all") return true;
  if (filter === "confident") return isConfidentAttempt(question);
  if (filter === "guessed") return isGuessedAttempt(question);
  if (filter === "high-guess") return isHighProbabilityGuess(question);
  if (filter === "unmarked-guess") return isUnmarkedLikelyGuess(question);
  if (filter === "mismatch") return isDecisionMismatch(question);
  if (filter === "slow-wrong") return isSlowWrong(question);
  return true;
}

function renderInsights(report, avgTime) {
  const insights = buildInsights(report, avgTime);
  els.insightList.innerHTML = insights.map((insight) => `
    <button class="insight" type="button" data-insight-filter="${insight.filter}">
      <strong>${escapeHtml(insight.title)}</strong>
      <span>${escapeHtml(insight.body)}</span>
    </button>
  `).join("");

  els.insightList.querySelectorAll("[data-insight-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.resultFilters.insight = button.dataset.insightFilter;
      renderResultFilters(report);
      renderQuestionReview(report);
    });
  });
}

function buildInsights(report, avgTime) {
  const attempted = report.questions.filter((q) => q.isAttempted);
  const confidentAttempts = report.questions.filter(isConfidentAttempt);
  const guessedAttempts = report.questions.filter(isGuessedAttempt);
  const highGuesses = report.questions.filter(isHighProbabilityGuess);
  const unmarkedLikelyGuesses = report.questions.filter(isUnmarkedLikelyGuess);
  const mismatches = report.questions.filter(isDecisionMismatch);
  const slowWrong = report.questions.filter((q) => !q.isCorrect && q.isAttempted && q.timeSpentSeconds > avgTime);
  const confidentAccuracy = accuracyLabel(confidentAttempts);
  const highGuessAccuracy = accuracyLabel(highGuesses);
  const highGuessWrong = highGuesses.filter((q) => !q.isCorrect).length;
  const subjectAccuracy = subjectAccuracyLabel(confidentAttempts);
  const conclusion = highGuesses.length
    ? `You should mark answers where you feel 70%+ chance; those guesses are running at ${highGuessAccuracy}.`
    : "You did not mark any 70%+ guesses yet. Start marking them so review separates knowledge from risk.";
  const mistakePattern = confidentAttempts.length && highGuesses.length
    ? `Confident attempts are at ${confidentAccuracy}; 70%+ guesses are at ${highGuessAccuracy}. If these stay close, analyze the mistakes, not only the guessing.`
    : "Use Guess on uncertain attempts so the report can separate confident mistakes from risk-managed guesses.";

  return [
    {
      title: "Attempts",
      body: `You confidently attempted ${confidentAttempts.length} questions and guessed ${guessedAttempts.length}. Total attempted: ${attempted.length}.`,
      filter: "confident"
    },
    {
      title: "Confident Attempts",
      body: `Subject-wise accuracy: ${subjectAccuracy}. Overall confident accuracy: ${confidentAccuracy}.`,
      filter: "confident"
    },
    {
      title: "70%+ Guessed Accuracy",
      body: `${highGuesses.length} high-probability guesses, ${highGuessAccuracy} accuracy, ${highGuessWrong} wrong. These are the first questions to review for overconfidence.`,
      filter: "high-guess"
    },
    {
      title: "Unmarked Guess Analysis",
      body: `${unmarkedLikelyGuesses.length} wrong attempts had no Guess percentage. Mark uncertain attempts so future review knows whether it was a mistake or a risk.`,
      filter: "unmarked-guess"
    },
    {
      title: "Highest % Mismatch",
      body: `${mismatches.length} answers differed from the option with your highest Guess percentage. Click to inspect decision conflicts.`,
      filter: "mismatch"
    },
    {
      title: "Time Risk",
      body: `${slowWrong.length} wrong answers took longer than your average question time. These are possible traps or sunk-cost questions.`,
      filter: "slow-wrong"
    },
    {
      title: "Conclusion",
      body: conclusion,
      filter: "high-guess"
    },
    {
      title: "Next Action",
      body: mistakePattern,
      filter: "confident"
    }
  ];
}

function accuracyLabel(questions) {
  if (!questions.length) return "0% (0/0)";
  const correct = questions.filter((q) => q.isCorrect).length;
  return `${Math.round((correct / questions.length) * 100)}% (${correct}/${questions.length})`;
}

function subjectAccuracyLabel(questions) {
  if (!questions.length) return "No confident attempts yet";
  const groups = questions.reduce((acc, question) => {
    acc[question.section] = acc[question.section] || [];
    acc[question.section].push(question);
    return acc;
  }, {});
  return Object.entries(groups)
    .map(([subject, items]) => `${subject}: ${accuracyLabel(items)}`)
    .join("; ");
}

function isConfidentAttempt(question) {
  if (!question.isAttempted) return false;
  if (!question.hasConfidence) return true;
  return Number(question.confidenceOnSelected || 0) >= 70;
}

function isGuessedAttempt(question) {
  return Boolean(question.isAttempted && question.hasConfidence);
}

function isHighProbabilityGuess(question) {
  return Boolean(isGuessedAttempt(question) && Number(question.confidenceOnSelected || 0) >= 70);
}

function isUnmarkedLikelyGuess(question) {
  return Boolean(question.isAttempted && !question.hasConfidence && !question.isCorrect);
}

function isDecisionMismatch(question) {
  return Boolean(question.hasConfidence && question.highestConfidenceOption && question.selectedAnswer && question.highestConfidenceOption !== question.selectedAnswer);
}

function isSlowWrong(question) {
  if (!state.latestReport) return false;
  const avgTime = state.latestReport.totalQuestions
    ? Math.round(state.latestReport.questions.reduce((sum, q) => sum + q.timeSpentSeconds, 0) / state.latestReport.totalQuestions)
    : 0;
  return Boolean(!question.isCorrect && question.isAttempted && question.timeSpentSeconds > avgTime);
}

function renderHistory() {
  if (!state.attempts.length) {
    els.historyList.innerHTML = `<div class="empty-state">No completed attempts yet.</div>`;
    return;
  }
  els.historyList.innerHTML = state.attempts.map((report) => `
    <article class="review-card">
      <div class="review-meta">
        <span>${new Date(report.submittedAt).toLocaleString()}</span>
        <span>${report.totalQuestions} questions</span>
      </div>
      <h3>${escapeHtml(report.testTitle)}</h3>
      <p>Score: <strong>${report.score}</strong> | Correct: <strong>${report.correct}</strong> | Incorrect: <strong>${report.incorrect}</strong></p>
      <button class="secondary-action" data-open-report="${report.id}">Open analysis</button>
    </article>
  `).join("");
  document.querySelectorAll("[data-open-report]").forEach((button) => {
    button.addEventListener("click", () => {
      const report = state.attempts.find((item) => item.id === button.dataset.openReport);
      if (report) {
        state.latestReport = report;
        renderResults(report);
        showView("results");
      }
    });
  });
}

function downloadReport() {
  if (!state.latestReport) return;
  const blob = new Blob([JSON.stringify(state.latestReport, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.latestReport.testTitle.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-attempt-report.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function printReport() {
  if (!state.latestReport) return;
  const originalTitle = document.title;
  document.title = `${state.latestReport.testTitle} Report`;
  window.print();
  document.title = originalTitle;
}

function highestConfidenceOption(confidence) {
  const entries = Object.entries(confidence).sort((a, b) => Number(b[1]) - Number(a[1]));
  if (!entries.length || Number(entries[0][1]) === 0) return null;
  return entries[0][0];
}

function optionKey(index) {
  return String.fromCharCode(65 + index);
}

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  setTimeout(() => els.toast.classList.add("hidden"), 3000);
}

init();
