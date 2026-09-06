// Βάση δεδομένων μαθημάτων από το επίσημο πρόγραμμα
const coursesData = [
  // 1ο Εξάμηνο
  {
    id: "m1_1",
    semester: 1,
    title: "Μεταναστευτικό Δίκαιο: διεθνείς, ευρωπαϊκές και εθνικές διαστάσεις",
    type: "Υποχρεωτικό (Υ)",
    ects: 8,
    instructors: "Δ. Λέντζης, Κ. Ρόκας, Β. Περγαντής, Α. Μα. Κώνστα"
  },
  {
    id: "m1_2",
    semester: 1,
    title: "Η δημοσιογραφική κάλυψη και έρευνα στη μετανάστευση",
    type: "Υποχρεωτικό (Υ)",
    ects: 8,
    instructors: "Σ. Καϊτατζή, Ι. Κωσταρέλλα, Γ. Χρηστίδης, Π. Νεράντζης"
  },
  {
    id: "m1_3",
    semester: 1,
    title: "Πολιτισμική Διαμεσολάβηση",
    type: "Επιλογής (Ε)",
    ects: 7,
    instructors: "Μ. Καβάλα, Θ. Τζήμας"
  },
  {
    id: "m1_4",
    semester: 1,
    title: "Ιστορικές καταβολές του φαινομένου",
    type: "Επιλογής (Ε)",
    ects: 7,
    instructors: "Κ. Τζιάρας"
  },
  {
    id: "m1_5",
    semester: 1,
    title: "Διεθνείς σχέσεις και πληθυσμοί σε κίνηση",
    type: "Επιλογής (Ε)",
    ects: 7,
    instructors: "Θ. Τζήμας"
  },

  // 2ο Εξάμηνο
  {
    id: "m2_1",
    semester: 2,
    title: "Οικονομικά της μετανάστευσης-αιτίες κι επιπτώσεις",
    type: "Υποχρεωτικό (Υ)",
    ects: 8,
    instructors: "Γρ. Ζαρωτιάδης"
  },
  {
    id: "m2_2",
    semester: 2,
    title: "Πολιτικές θεωρίες και πρακτικές, προσφυγικό και πληθυσμοί σε κίνηση",
    type: "Υποχρεωτικό (Υ)",
    ects: 8,
    instructors: "Σπ. Μαρκέτος"
  },
  {
    id: "m2_3",
    semester: 2,
    title: "Προσφυγικό δίκαιο: διεθνείς, ευρωπαϊκές και εθνικές διαστάσεις",
    type: "Επιλογής (Ε)",
    ects: 7,
    instructors: "Άννα Μαρία Κώνστα, Β. Περγαντής"
  },
  {
    id: "m2_4",
    semester: 2,
    title: "Μέσα κοινωνικής δικτύωσης και πληθυσμοί σε κίνηση",
    type: "Επιλογής (Ε)",
    ects: 7,
    instructors: "Νάγια Καλφέλη"
  },
  {
    id: "m2_5",
    semester: 2,
    title: "Διοίκηση δομών υποδοχής και φιλοξενίας",
    type: "Επιλογής (Ε)",
    ects: 7,
    instructors: "Κ. Καμβύση"
  }
];

let allPapers = [];

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  buildCourseOptions();
  loadPapers();
  setupEventListeners();
});

// Εναλλαγή καρτελών
function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.add("active");
    });
  });
}

// Δημιουργία των επιλογών στο dropdown μαθημάτων ανάλογα με το εξάμηνο
function buildCourseOptions(filteredSemester = "all") {
  const courseSelect = document.getElementById("courseSelect");
  courseSelect.innerHTML = '<option value="all">Όλα τα Μαθήματα</option>';

  const s1Courses = coursesData.filter(c => c.semester === 1);
  const s2Courses = coursesData.filter(c => c.semester === 2);

  if (filteredSemester === "all" || filteredSemester === "1") {
    const group1 = document.createElement("optgroup");
    group1.label = "── Α' Εξάμηνο ──";
    s1Courses.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.title;
      opt.textContent = c.title;
      group1.appendChild(opt);
    });
    courseSelect.appendChild(group1);
  }

  if (filteredSemester === "all" || filteredSemester === "2") {
    const group2 = document.createElement("optgroup");
    group2.label = "── Β' Εξάμηνο ──";
    s2Courses.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.title;
      opt.textContent = c.title;
      group2.appendChild(opt);
    });
    courseSelect.appendChild(group2);
  }
}

// Φόρτωση των εργασιών από το JSON
async function loadPapers() {
  try {
    const res = await fetch("data/papers.json");
    allPapers = await res.json();
    renderPapers(allPapers);
  } catch (err) {
    console.error("Σφάλμα φόρτωσης papers.json:", err);
  }
}

// Προβολή στοιχείων επιλεγμένου μαθήματος και καθηγητών
function updateCourseCard(selectedCourseTitle) {
  const card = document.getElementById("courseInfoCard");
  if (!selectedCourseTitle || selectedCourseTitle === "all") {
    card.style.display = "none";
    return;
  }

  const course = coursesData.find(c => c.title === selectedCourseTitle);
  if (course) {
    document.getElementById("infoCourseTitle").textContent = course.title;
    document.getElementById("infoInstructors").textContent = course.instructors;
    document.getElementById("infoSemesterBadge").textContent = course.semester === 1 ? "Α' Εξάμηνο" : "Β' Εξάμηνο";
    document.getElementById("infoType").textContent = course.type;
    document.getElementById("infoEcts").textContent = course.ects;
    card.style.display = "block";
  } else {
    card.style.display = "none";
  }
}

// Προβολή καρτών εργασιών
function renderPapers(papers) {
  const grid = document.getElementById("papersGrid");
  grid.innerHTML = "";

  if (papers.length === 0) {
    grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #718096; padding: 2rem;'>Δεν βρέθηκαν αναρτημένες εργασίες για τα επιλεγμένα κριτήρια.</p>";
    return;
  }

  papers.forEach(p => {
    // Εύρεση του μαθήματος για να πάρουμε τους διδάσκοντες
    const courseObj = coursesData.find(c => c.title === p.course);
    const instructorsText = courseObj ? courseObj.instructors : (p.instructors || "-");

    const card = document.createElement("div");
    card.className = "paper-card";
    card.innerHTML = `
      <div>
        <h3>${p.title}</h3>
        <p class="paper-meta"><strong>Συγγραφέας:</strong> ${p.author} (${p.year})</p>
        <p class="paper-meta"><strong>Μάθημα:</strong> ${p.course}</p>
        <p class="paper-meta"><strong>Διδάσκοντες/ουσες:</strong> ${instructorsText}</p>
        <div class="tags">
          ${(p.keywords || []).map(k => `<span class="tag">#${k}</span>`).join("")}
        </div>
      </div>
      <a href="${p.pdfUrl}" target="_blank" class="btn">Προβολή / Λήψη PDF</a>
    `;
    grid.appendChild(card);
  });
}

// Ενιαίο φιλτράρισμα (Εξάμηνο + Μάθημα + Search Input)
function filterAll() {
  const semesterVal = document.getElementById("semesterFilter").value;
  const courseVal = document.getElementById("courseSelect").value;
  const term = document.getElementById("searchInput").value.toLowerCase().trim();

  updateCourseCard(courseVal);

  const filtered = allPapers.filter(p => {
    // Εύρεση του μαθήματος της εργασίας
    const cObj = coursesData.find(c => c.title === p.course);
    const paperSemester = cObj ? String(cObj.semester) : String(p.semester || "");

    const matchesSemester = (semesterVal === "all" || paperSemester === semesterVal);
    const matchesCourse = (courseVal === "all" || p.course === courseVal);

    const matchesText = 
      p.title.toLowerCase().includes(term) ||
      p.author.toLowerCase().includes(term) ||
      (p.keywords && p.keywords.some(k => k.toLowerCase().includes(term)));

    return matchesSemester && matchesCourse && matchesText;
  });

  renderPapers(filtered);
}

// Event Listeners
function setupEventListeners() {
  const semesterFilter = document.getElementById("semesterFilter");
  const courseSelect = document.getElementById("courseSelect");
  const searchInput = document.getElementById("searchInput");

  semesterFilter.addEventListener("change", () => {
    buildCourseOptions(semesterFilter.value);
    filterAll();
  });

  courseSelect.addEventListener("change", filterAll);
  searchInput.addEventListener("input", filterAll);
}