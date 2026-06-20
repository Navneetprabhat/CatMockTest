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
  latestReport: null
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
  toast: document.getElementById("toast"),
  metricAttempts: document.getElementById("metric-attempts"),
  metricBest: document.getElementById("metric-best"),
  metricTime: document.getElementById("metric-time"),
  metricConfidence: document.getElementById("metric-confidence"),
  answeredCount: document.getElementById("answered-count"),
  notAnsweredCount: document.getElementById("not-answered-count"),
  notVisitedCount: document.getElementById("not-visited-count"),
  reviewCount: document.getElementById("review-count"),
  answeredReviewCount: document.getElementById("answered-review-count")
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
  els.toggleReview.addEventListener("click", toggleReview);
  els.saveNext.addEventListener("click", saveAndNext);
  els.nextSection.addEventListener("click", moveToNextSection);
  els.submitTest.addEventListener("click", submitAttempt);
  els.clearConfidence.addEventListener("click", clearConfidence);
  els.downloadReport.addEventListener("click", downloadReport);
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
  els.passageText.textContent = resource.text || "No passage or caselet is required for this question.";
  els.marksLine.textContent = `Marks for correct answer: ${question.marks} | Negative Marks: ${Math.abs(question.negativeMarks)}`;
  els.toggleReview.textContent = "Mark for Review & Next";

  if (question.type === "mcq") {
    els.optionList.classList.remove("hidden");
    els.titaBox.classList.add("hidden");
    els.confidencePanel.classList.add("hidden");
    renderOptions(question, response);
  } else {
    els.optionList.classList.add("hidden");
    els.titaBox.classList.remove("hidden");
    els.confidencePanel.classList.add("hidden");
    els.titaAnswer.value = response.answer || "";
  }

  renderTabs();
  renderPalette();
  renderStatusCounts(questions);
  renderTimers();
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
    const value = Number(response.confidence[key] || 0);
    return `
      <label class="confidence-row">
        <span>${key}. ${escapeHtml(getOptionText(option))}</span>
        <input type="range" min="0" max="100" step="10" value="${value}" data-confidence="${key}" />
        <strong>${value}%</strong>
      </label>
    `;
  }).join("");

  els.confidenceControls.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      response.confidence[input.dataset.confidence] = Number(input.value);
      response.hasConfidence = confidenceTotal(response) > 0;
      renderConfidence(question, response);
    });
  });
  updateConfidenceTotal(response);
}

function confidenceTotal(response) {
  return Object.values(response.confidence).reduce((sum, value) => sum + Number(value || 0), 0);
}

function updateConfidenceTotal(response) {
  const total = confidenceTotal(response);
  els.confidenceTotal.textContent = `Total: ${total}%`;
  els.confidenceTotal.classList.toggle("invalid", response.hasConfidence && total !== 100);
}

function clearConfidence() {
  const response = getCurrentQuestionAttempt();
  response.confidence = {};
  response.hasConfidence = false;
  renderAttemptPreserveTime();
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
  if (response.hasConfidence && confidenceTotal(response) !== 100) {
    showToast("Confidence mapping is optional, but if used it must total 100%.");
    return;
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

      questions.push({
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
        confidenceOnSelected: response.hasConfidence ? Number(response.confidence[response.answer] || 0) : null,
        confidenceOnCorrect: response.hasConfidence ? Number(response.confidence[question.correctAnswer] || 0) : null,
        highestConfidenceOption: response.hasConfidence ? highestConfidenceOption(response.confidence) : null,
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
  const accuracy = report.totalQuestions ? Math.round((report.correct / report.totalQuestions) * 100) : 0;
  const attempted = report.correct + report.incorrect;
  const avgTime = report.totalQuestions ? Math.round(report.questions.reduce((sum, q) => sum + q.timeSpentSeconds, 0) / report.totalQuestions) : 0;
  const confidenceUsed = report.questions.filter((q) => q.hasConfidence).length;

  els.resultTitle.textContent = report.testTitle;
  els.resultSubtitle.textContent = `${attempted} attempted, ${report.unattempted} unattempted, ${accuracy}% accuracy across all questions.`;
  els.resultSummary.innerHTML = `
    ${metricMarkup("Score", report.score)}
    ${metricMarkup("Correct", report.correct)}
    ${metricMarkup("Incorrect", report.incorrect)}
    ${metricMarkup("Avg time", `${avgTime}s`)}
  `;

  els.questionReview.innerHTML = report.questions.map((q, index) => {
    const status = !q.isAttempted ? "Unattempted" : q.isCorrect ? "Correct" : "Incorrect";
    const statusClass = q.isCorrect ? "status-good" : q.isAttempted ? "status-bad" : "";
    const mismatch = q.hasConfidence && q.highestConfidenceOption && q.selectedAnswer && q.highestConfidenceOption !== q.selectedAnswer;
    return `
      <article class="review-card">
        <div class="review-meta">
          <span>Q${index + 1}</span>
          <span>${escapeHtml(q.section)}</span>
          <span>${q.timeSpentSeconds}s</span>
          <span>${q.visits} visits</span>
          <span class="${statusClass}">${status}</span>
          ${q.markedForReview ? "<span>Marked for review</span>" : ""}
        </div>
        <h3>${escapeHtml(q.question)}</h3>
        <p>Selected: <strong>${escapeHtml(q.selectedAnswer || "None")}</strong> | Correct: <strong>${escapeHtml(String(q.correctAnswer))}</strong> | Marks: <strong>${q.marks}</strong></p>
        ${q.hasConfidence ? `<p>Confidence on selected: <strong>${q.confidenceOnSelected}%</strong> | Confidence on correct: <strong>${q.confidenceOnCorrect}%</strong> | Highest confidence: <strong>${q.highestConfidenceOption}</strong></p>` : "<p>No confidence mapping provided.</p>"}
        ${mismatch ? "<p><strong>Decision mismatch:</strong> selected answer differs from highest-confidence option.</p>" : ""}
        ${q.explanation ? `<p>${escapeHtml(q.explanation)}</p>` : ""}
      </article>
    `;
  }).join("");

  els.insightList.innerHTML = buildInsights(report, confidenceUsed, avgTime).map((insight) => `<div class="insight">${insight}</div>`).join("");
  renderHistory();
}

function metricMarkup(label, value) {
  return `<article class="metric-card"><span>${label}</span><strong>${value}</strong></article>`;
}

function buildInsights(report, confidenceUsed, avgTime) {
  const highConfidenceWrong = report.questions.filter((q) => !q.isCorrect && q.hasConfidence && q.confidenceOnSelected >= 70).length;
  const knewButMissed = report.questions.filter((q) => !q.isCorrect && q.hasConfidence && q.confidenceOnCorrect >= 70).length;
  const mismatches = report.questions.filter((q) => q.hasConfidence && q.selectedAnswer && q.highestConfidenceOption !== q.selectedAnswer).length;
  const slowWrong = report.questions.filter((q) => !q.isCorrect && q.isAttempted && q.timeSpentSeconds > avgTime).length;
  return [
    `Confidence mapping was used on ${confidenceUsed} of ${report.totalQuestions} questions.`,
    `${mismatches} questions had a selected answer different from the highest-confidence option.`,
    `${highConfidenceWrong} incorrect answers had at least 70% confidence on the selected option.`,
    `${knewButMissed} misses gave at least 70% confidence to the correct answer.`,
    `${slowWrong} wrong answers took longer than your average question time.`
  ];
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
