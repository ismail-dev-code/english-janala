function loadData() {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => {
      showData(data.data);

      //Load all lessons
      loadAllLessons(data.data);
    });
}

// Show ALL lessons 
function loadAllLessons(allLessons) {
  const lessonCards = document.getElementById("lesson-cards");
  lessonCards.innerHTML = "";
  lessonCards.classList.add("grid", "grid-cols-3", "gap-7");

  allLessons.forEach((lesson) => {
    fetch(`https://openapi.programming-hero.com/api/level/${lesson.level_no}`)
      .then((res) => res.json())
      .then((data) => {
        showSingleLesson(data.data, true); 
      });
  });
}

// Modified showSingleLesson so it can append when "all" is shown
function showSingleLesson(data, append = false) {
  const lessonCards = document.getElementById("lesson-cards");

  if (!append) {
    lessonCards.innerHTML = "";
  }

  if (data.length === 0 || !data) {
    if (!append) {
      lessonCards.classList.remove("grid", "grid-cols-3", "gap-7");
      lessonCards.innerHTML = `<div class="w-full flex flex-col justify-center items-center text-center py-10">
                <img src="./assets/alert-error.png" alt="">
              <h2 class="text-lg font-medium">
                এই Lesson এ এখনো কোনো Vocabulary যুক্ত করা হয়নি।
              </h2>
              <h1 class="text-2xl font-semibold mt-2">
                পরবর্তী Lesson-এ যান।
              </h1>
            </div>`;
    }
  } else {
    lessonCards.classList.add("grid", "grid-cols-3", "gap-7");
    data.forEach((singleLesson) => {
      const createDiv = document.createElement("div");
      createDiv.innerHTML = ` 
        <div class="card bg-white hover:bg-slate-100">
          <div class="card-body items-center text-center">
            <h2 class="card-title">${!singleLesson.word ? "শব্দ পাওয়া যায়নি" : singleLesson.word}</h2>
            <p>Meaning / Pronunciation</p>
            <h2 class="card-title">${!singleLesson.meaning ? "অর্থ পাওয়া যায়নি" : singleLesson.meaning} / ${!singleLesson.pronunciation ? "উচ্চারন পাওয়া যায়নি" : singleLesson.pronunciation}</h2>
    
            <div class="w-full my-2 flex justify-between">
              <button onclick="loadModalData('${singleLesson.id}')" class="btn"><i class="fa-solid fa-circle-info"></i></button>
              <button onclick="pronounceWord('${singleLesson.word}')" class="btn"><i class="fa-solid fa-volume-high"></i></button>
            </div>
          </div>
        </div>`;
      lessonCards.append(createDiv);
    });
  }
}

// Update lesson buttons to also include "All"
function showData(data) {
  const lessonBtn = document.getElementById("lesson-btn");

  // Add ALL button
  const allBtn = document.createElement("button");
  allBtn.className = "btn btnNew bg-[#422AD5] text-white py-2 px-4 border-[#422AD5]";
  allBtn.innerHTML = `<i class="fa-solid fa-layer-group"></i> All`;
  allBtn.onclick = function () {
    document.querySelectorAll(".btnNew").forEach((createdBtnActive) => {
      createdBtnActive.classList.remove("bg-[#422AD5]", "text-white");
    });
    allBtn.classList.add("bg-[#422AD5]", "text-white");
    loadAllLessons(data);
  };
  lessonBtn.append(allBtn);

  // Add lesson buttons
  data.forEach((value) => {
    const createBtn = document.createElement("button");
    createBtn.className =
      "btn btnNew text-[#422AD5] border-[#422AD5] py-2 px-4 hover:bg-[#422AD5] hover:text-white";
    createBtn.innerHTML = `<i class="fa-solid fa-book-open"></i> ${value.lessonName}`;

    createBtn.onclick = function () {
      loadSingleLesson(value.level_no);
    };
    createBtn.addEventListener("click", function () {
      document.querySelectorAll(".btnNew").forEach((createdBtnActive) => {
        createdBtnActive.classList.remove("bg-[#422AD5]", "text-white");
      });
      createBtn.classList.add("bg-[#422AD5]", "text-white");
    });
    lessonBtn.append(createBtn);
  });
}
