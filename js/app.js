let allPapers = [];

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  loadPapers();
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
      const targetContent = document.getElementById(target);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
}

// Φόρτωση εργασιών
async function loadPapers() {
  try {
    const res = await fetch("data/papers.json");
    allPapers = await res.json();
    populateCourseFilter(allPapers);
    renderPapers(allPapers);
    setupSearch();
  } catch (err) {
    console.error("Σφάλμα φόρτωσης αρχείου JSON:", err);
  }
}

// Συμπλήρωση dropdown μαθημάτων
function populateCourseFilter(papers) {
  const filter = document.getElementById("courseFilter");
  const courses = [...new Set(papers.map(p => p.course))];
  courses.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    filter.appendChild(opt);
  });
}

// Εμφάνιση καρτών
function renderPapers(papers) {
  const grid = document.getElementById("papersGrid");
  grid.innerHTML = "";

  if (papers.length === 0) {
    grid.innerHTML = "<p style='grid-column: 1/-1;'>Δεν βρέθηκαν εργασίες με αυτά τα κριτήρια αναζήτησης.</p>";
    return;
  }

  papers.forEach(p => {
    const card = document.createElement("div");
    card.className = "paper-card";
    card.innerHTML = `
      <div>
        <h3>${p.title}</h3>
        <p class="paper-meta"><strong>Συγγραφέας:</strong> ${p.author} (${p.year})</p>
        <p class="paper-meta"><strong>Μάθημα:</strong> ${p.course}</p>
        <div class="tags">
          ${p.keywords.map(k => `<span class="tag">#${k}</span>`).join("")}
        </div>
      </div>
      <a href="${p.pdfUrl}" target="_blank" class="btn">Προβολή / Λήψη PDF</a>
    `;
    grid.appendChild(card);
  });
}

// Ζωντανή αναζήτηση & φίλτρο
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const courseFilter = document.getElementById("courseFilter");

  function filter() {
    const term = searchInput.value.toLowerCase().trim();
    const selectedCourse = courseFilter.value;

    const filtered = allPapers.filter(p => {
      const matchesCourse = (selectedCourse === "all" || p.course === selectedCourse);
      const matchesText = 
        p.title.toLowerCase().includes(term) ||
        p.author.toLowerCase().includes(term) ||
        p.keywords.some(k => k.toLowerCase().includes(term));

      return matchesCourse && matchesText;
    });

    renderPapers(filtered);
  }

  searchInput.addEventListener("input", filter);
  courseFilter.addEventListener("change", filter);
}