// ========== API BASE ==========
const API_BASE = "https://openapi.programming-hero.com/api";

// ========== MAIN INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  loadData();
});

// ========== FETCH FUNCTIONS ==========
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response failed");
    return await res.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

// Load all lesson meta info
async function loadData() {
  const res = await fetchJSON(`${API_BASE}/levels/all`);
  if (res && res.data) {
    showLessonButtons(res.data);
    loadAllLessons(res.data); 
  }
}

// Load ALL lessons together
async function loadAllLessons(allLessons) {
  const lessonCards = document.getElementById("lesson-cards");
  showSpinner(lessonCards);

  lessonCards.classList.add("grid", "grid-cols-3", "gap-7");
  lessonCards.innerHTML = "";

  for (const lesson of allLessons) {
    const res = await fetchJSON(`${API_BASE}/level/${lesson.level_no}`);
    if (res && res.data) {
      showSingleLesson(res.data, true);
    }
  }
}

// Load only one lesson (filtered)
async function loadSingleLesson(level_no) {
  const lessonCards = document.getElementById("lesson-cards");
  showSpinner(lessonCards);

  const res = await fetchJSON(`${API_BASE}/level/${level_no}`);
  lessonCards.innerHTML = "";

  if (res && res.data) {
    showSingleLesson(res.data);
  } else {
    showErrorMessage(lessonCards);
  }
}

// ========== UI RENDER FUNCTIONS ==========
function showSingleLesson(data, append = false) {
  const lessonCards = document.getElementById("lesson-cards");
  if (!append) lessonCards.innerHTML = "";

  if (!data || data.length === 0) {
    if (!append) showEmptyMessage(lessonCards);
    return;
  }

  lessonCards.classList.add("grid", "grid-cols-3", "gap-7");

  data.forEach((lesson) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="card bg-white hover:bg-slate-100 transition">
        <div class="card-body items-center text-center">
          <h2 class="card-title">${lesson.word || "শব্দ পাওয়া যায়নি"}</h2>
          <p>Meaning / Pronunciation</p>
          <h2 class="card-title">
            ${lesson.meaning || "অর্থ পাওয়া যায়নি"} / 
            ${lesson.pronunciation || "উচ্চারন পাওয়া যায়নি"}
          </h2>
          <div class="w-full my-2 flex justify-between">
            <button onclick="loadModalData('${lesson.id}')" class="btn">
              <i class="fa-solid fa-circle-info"></i>
            </button>
            <button onclick="pronounceWord('${lesson.word}')" class="btn">
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </div>
        </div>
      </div>`;
    lessonCards.appendChild(card);
  });
}

// Show lesson buttons (including "All")
function showLessonButtons(data) {
  const lessonBtn = document.getElementById("lesson-btn");
  lessonBtn.innerHTML = "";

  // "All" Button
  const allBtn = createLessonButton("All", "fa-layer-group", true);
  allBtn.addEventListener("click", () => {
    setActiveButton(allBtn);
    loadAllLessons(data);
  });
  lessonBtn.appendChild(allBtn);

  // Individual lesson buttons
  data.forEach((lesson) => {
    const btn = createLessonButton(lesson.lessonName, "fa-book-open");
    btn.addEventListener("click", () => {
      setActiveButton(btn);
      loadSingleLesson(lesson.level_no);
    });
    lessonBtn.appendChild(btn);
  });
}

//  Create a styled button
function createLessonButton(label, icon, isActive = false) {
  const btn = document.createElement("button");
  btn.className =
    "btn btnNew py-2 px-4 border-[#422AD5] hover:bg-[#422AD5] hover:text-white";
  btn.innerHTML = `<i class="fa-solid ${icon}"></i> ${label}`;
  if (isActive) btn.classList.add("bg-[#422AD5]", "text-white");
  return btn;
}

//Set active button style
function setActiveButton(activeBtn) {
  document.querySelectorAll(".btnNew").forEach((btn) => {
    btn.classList.remove("bg-[#422AD5]", "text-white");
  });
  activeBtn.classList.add("bg-[#422AD5]", "text-white");
}

// ========== FEEDBACK UI ==========
function showSpinner(container) {
  container.innerHTML = `
    <div class="flex justify-center items-center w-full py-10">
      <span class="loading loading-dots loading-lg"></span>
    </div>`;
}

function showErrorMessage(container) {
  container.innerHTML = `
    <div class="text-center py-10 text-red-600 font-semibold">
      Error loading data. Please try again.
    </div>`;
}

function showEmptyMessage(container) {
  container.innerHTML = `
    <div class="w-full flex flex-col justify-center items-center text-center py-10">
      <img src="./assets/alert-error.png" alt="">
      <h2 class="text-lg font-medium">
        এই Lesson এ এখনো কোনো Vocabulary যুক্ত করা হয়নি।
      </h2>
      <h1 class="text-2xl font-semibold mt-2">
        পরবর্তী Lesson-এ যান।
      </h1>
    </div>`;
}

// ========== EXTRA FEATURES ==========
async function loadModalData(id) {
  const res = await fetchJSON(`${API_BASE}/word/${id}`);
  if (res && res.data) modalShow(res.data);
}

function modalShow(data) {
  const modal = document.getElementById("my_modal_5");
  modal.innerHTML = `
    <div class="modal-box w-full hover:bg-slate-50">
      <h3 class="text-2xl font-bold text-left">
        ${data.word} (<i class="fa-solid fa-microphone-lines"></i>: ${data.pronunciation})
      </h3>
      <h3 class="text-xm font-bold text-left pt-4">Meaning <br>
        <span class="font-light">${data.meaning || "অর্থ পাওয়া যায়নি"}</span>
      </h3>
      <h3 class="text-xm font-bold text-left pt-4">Example <br>
        <span class="font-light">${data.sentence || "বাক্য পাওয়া যায়নি"}</span>
      </h3>
      <h3 class="text-xm font-bold text-left pt-4">সমার্থক শব্দ গুলো <br>
        <span class="font-light">${data.synonyms || "সমার্থক শব্দ পাওয়া যায়নি"}</span>
      </h3>
      <div class="modal-action flex justify-start">
        <form method="dialog">
          <button class="btn w-full text-[#422AD5] border-[#422AD5] hover:bg-[#422AD5] hover:text-white">
            Complete Learning
          </button>
        </form>
      </div>
    </div>`;
  modal.showModal();
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN";
  window.speechSynthesis.speak(utterance);
}
