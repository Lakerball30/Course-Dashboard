const fullData = [
  { id: "c1", code: "CIS 101", title: "Intro to Web design", instructor: "Ada Brooks", credits: 3, level: "intro", status: "open", enrolled: 18, capacity: 30, room: "B-204" },
  { id: "c2", code: "CIS 150", title: "Web Fundamentals", instructor: "Marcus Lee", credits: 3, level: "intro", status: "full", enrolled: 25, capacity: 25, room: "B-110" },
  { id: "c3", code: "CIS 210", title: "JavaScript Programming", instructor: "Priya Shah", credits: 4, level: "intermediate", status: "open", enrolled: 22, capacity: 28, room: "C-015" },
  { id: "c4", code: "CIS 220", title: "Databases", instructor: "Tom Alvarez", credits: 3, level: "intermediate", status: "waitlist", enrolled: 24, capacity: 24, room: "C-120" },
  { id: "c5", code: "CIS 240", title: "Networking Basics", instructor: "Dana Whitfield", credits: 3, level: "intermediate", status: "open", enrolled: 10, capacity: 24, room: "A-300" },
  { id: "c6", code: "CIS 310", title: "Information Security", instructor: "Ada Brooks", credits: 3, level: "advanced", status: "open", enrolled: 15, capacity: 20, room: "A-210" },
  { id: "c7", code: "CIS 320", title: "Software Engineering", instructor: "Priya Shah", credits: 4, level: "advanced", status: "waitlist", enrolled: 20, capacity: 20, room: "C-201" },
  { id: "c8", code: "CIS 350", title: "Practical software", instructor: "Marcus Lee", credits: 3, level: "advanced", status: "open", enrolled: 8, capacity: 22, room: "B-305" },
  { id: "c9", code: "CIS 399", title: "LLC nursing Project", instructor: "Dana Whitfield", credits: 2, level: "advanced", status: "full", enrolled: 12, capacity: 12, room: "A-100" }
];
const missingOptionalData = JSON.parse(JSON.stringify(fullData));
delete missingOptionalData[2].room;
const invalidData = [
  fullData[0],
  { id: "x1", code: "BAD 100", title: "", instructor: "Nobody", credits: 3, level: "intro", status: "open", enrolled: 5, capacity: 20 },
  { id: "x2", code: "BAD 200", title: "Negative Credits", instructor: "Nobody", credits: -2, level: "intro", status: "open", enrolled: 5, capacity: 20 },
  { id: "x3", code: "BAD 300", title: "Too Many Students", instructor: "Nobody", credits: 3, level: "advanced", status: "open", enrolled: 40, capacity: 20 },
  null,
  fullData[2],
  fullData[5],
  fullData[7],
  fullData[8],
  fullData[4],
  fullData[3]
];
const datasets = {
  full: fullData,
  empty: [],
  missingOptional: missingOptionalData,
  invalid: invalidData
};
let currentData = "full";
let statusFilter = "all";
let levelFilter = "all";
let searchText = "";
function showMessage(type, text, details) {
  const box = document.querySelector("#app-status");
  box.textContent = "";
  box.dataset.type = type;
  const line = document.createElement("span");
  line.textContent = text;
  box.appendChild(line);
  if (details) {
    const list = document.createElement("ul");
    for (let i = 0; i < details.length; i++) {
      const item = document.createElement("li");
      item.textContent = details[i];
      list.appendChild(item);
    }
    box.appendChild(list);
  }
}
function checkCourse(course) {
  if (course === null || typeof course !== "object") {
    return "record is not an object";
  }
  if (!course.title) {
    return "title is missing";
  }
  if (typeof course.credits !== "number" || course.credits <= 0) {
    return "credits must be a positive number";
  }
  if (course.enrolled > course.capacity) {
    return "enrolled is greater than capacity";
  }
  return "";
}
function courseMatchesFilters(course) {
  if (statusFilter !== "all" && course.status !== statusFilter) {
    return false;
  }
  if (levelFilter !== "all" && course.level !== levelFilter) {
    return false;
  }
  const text = (course.title + " " + course.code + " " + course.instructor).toLowerCase();
  if (searchText !== "" && !text.includes(searchText.toLowerCase())) {
    return false;
  }
  return true;
}
function addSummaryCard(box, label, value) {
  const card = document.createElement("div");
  card.className = "summary-card";
  const valueDiv = document.createElement("div");
  valueDiv.className = "value";
  valueDiv.textContent = value;
  const labelDiv = document.createElement("div");
  labelDiv.className = "label";
  labelDiv.textContent = label;
  card.appendChild(valueDiv);
  card.appendChild(labelDiv);
  box.appendChild(card);
}
function showSummary(courses) {
  let openCount = 0;
  let totalCredits = 0;
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].status === "open") {
      openCount++;
    }
    totalCredits += courses[i].credits;
  }
  let averageCredits = 0;
  if (courses.length > 0) {
    averageCredits = totalCredits / courses.length;
  }
  const box = document.querySelector("#summary");
  box.textContent = "";
  addSummaryCard(box, "Courses shown", courses.length);
  addSummaryCard(box, "Open courses", openCount);
  addSummaryCard(box, "Average credits", averageCredits.toFixed(1));
}
function addRow(list, label, text) {
  const term = document.createElement("dt");
  term.textContent = label;
  const value = document.createElement("dd");
  value.textContent = text;
  list.appendChild(term);
  list.appendChild(value);
  return value;
}
function makeCard(course) {
  const card = document.createElement("article");
  card.className = "course-card";
  card.dataset.status = course.status;
  card.dataset.level = course.level;
  const title = document.createElement("h3");
  title.textContent = course.title;
  const code = document.createElement("p");
  code.className = "code";
  code.textContent = course.code;
  const details = document.createElement("dl");
  const statusRow = addRow(details, "Status", course.status);
  statusRow.className = "badge";
  addRow(details, "Level", course.level);
  addRow(details, "Instructor", course.instructor);
  addRow(details, "Credits", course.credits);
  addRow(details, "Enrolled", course.enrolled + " / " + course.capacity);
  if (course.room) {
    addRow(details, "Room", course.room);
  } else {
    const roomRow = addRow(details, "Room", "Not provided");
    roomRow.className = "missing";
  }
  card.appendChild(title);
  card.appendChild(code);
  card.appendChild(details);
  return card;
}
function showCourses(listSelector) {
  const list = document.querySelector(listSelector);
  if (list === null) {
    console.error("Selector failure: nothing matched " + listSelector);
    showMessage("error", "Render failed: could not find the element \"" + listSelector + "\".");
    return;
  }
  list.textContent = "";
  const records = datasets[currentData];
  const validCourses = [];
  const problems = [];
  for (let i = 0; i < records.length; i++) {
    const problem = checkCourse(records[i]);
    if (problem === "") {
      validCourses.push(records[i]);
    } else {
      let name = "record #" + (i + 1);
      if (records[i] && records[i].code) {
        name = records[i].code;
      }
      problems.push(name + ": " + problem);
    }
  }
  const visibleCourses = [];
  for (let i = 0; i < validCourses.length; i++) {
    if (courseMatchesFilters(validCourses[i])) {
      visibleCourses.push(validCourses[i]);
    }
  }
  showSummary(visibleCourses);
  if (problems.length > 0) {
    showMessage("warning", problems.length + " invalid record(s) skipped. " + validCourses.length + " valid record(s) loaded.", problems);
  } else if (records.length === 0) {
    showMessage("info", "Empty state: the data set contains no courses.");
  } else if (visibleCourses.length === 0) {
    showMessage("info", "No courses match the current filters.");
  } else {
    showMessage("info", "Showing " + visibleCourses.length + " of " + validCourses.length + " course(s).");
  }
  if (visibleCourses.length === 0) {
    const empty = document.createElement("p");
    empty.className = "message";
    empty.dataset.type = "info";
    empty.textContent = "There are no courses to display.";
    list.appendChild(empty);
    return;
  }
  for (let i = 0; i < visibleCourses.length; i++) {
    list.appendChild(makeCard(visibleCourses[i]));
  }
}
const datasetSelect = document.querySelector("#dataset-select");
const statusSelect = document.querySelector("#status-filter");
const levelSelect = document.querySelector("#level-filter");
const searchInput = document.querySelector("#search-input");
const failureButton = document.querySelector("#selector-failure-btn");
datasetSelect.addEventListener("change", function () {
  currentData = datasetSelect.value;
  showCourses("#course-list");
});
statusSelect.addEventListener("change", function () {
  statusFilter = statusSelect.value;
  showCourses("#course-list");
});
levelSelect.addEventListener("change", function () {
  levelFilter = levelSelect.value;
  showCourses("#course-list");
});
searchInput.addEventListener("input", function () {
  searchText = searchInput.value;
  showCourses("#course-list");
});
failureButton.addEventListener("click", function () {
  showCourses("#does-not-exist");
});
showCourses("#course-list");