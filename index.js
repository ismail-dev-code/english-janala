document.getElementById("get-btn").addEventListener("click", (event) => {
    const userName = document.getElementById("user-name").value;
    const userPassword = document.getElementById("user-password").value;
    const defaultHidden = document.querySelectorAll(".defaultHidden");
    const defaultBlock = document.querySelectorAll(".defaultBlock");
    if (!userName || typeof userName !== 'string' || !isNaN(userName)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Name!",
      });
    } else if (userPassword === "123456") {
      for (let i = 0; i < defaultHidden.length; i++) {
        defaultHidden[i].classList.remove("hidden");
      }
      for (let i = 0; i < defaultBlock.length; i++) {
        defaultBlock[i].classList.add("hidden");
      }
      Swal.fire({
        title: "Log In Successful",
        icon: "success",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Wrong Password!",
      });
    }
    event.preventDefault();
  });
  
  document.getElementById("logout").addEventListener("click", () => {
    const defaultHidden = document.querySelectorAll(".defaultHidden");
    const defaultBlock = document.querySelectorAll(".defaultBlock");
  
    for (let i = 0; i < defaultHidden.length; i++) {
      defaultHidden[i].classList.add("hidden");
    }
    for (let i = 0; i < defaultBlock.length; i++) {
      defaultBlock[i].classList.remove("hidden");
    }
    Swal.fire({
      title: "Log Out Successful!",
      icon: "success",
    });
  });
  
  function loadData() {
    fetch("https://openapi.programming-hero.com/api/levels/all")
      .then((res) => res.json())
      .then((data) => showData(data.data));
  }
  
  function loadSingleLesson(lesson_no) {
    const lessonCards = document.getElementById("lesson-cards");
    const loadingSpinner = document.getElementById("spinner");
  
    lessonCards.innerHTML = "";
  
    const spinner = document.createElement("div");
    lessonCards.classList.remove("grid", "grid-cols-3", "gap-7");
    spinner.className =
      "flex justify-center items-center  mx-w-10/12 mx-auto py-10";
    spinner.innerHTML = `<span class="loading loading-dots loading-xs"></span>
              <span class="loading loading-dots loading-sm"></span>
              <span class="loading loading-dots loading-md"></span>
              <span class="loading loading-dots loading-lg"></span>
              <span class="loading loading-dots loading-xl"></span>`;
    lessonCards.appendChild(spinner);
  
    fetch(`https://openapi.programming-hero.com/api/level/${lesson_no}`)
      .then((res) => res.json())
      .then((data) => {
        lessonCards.innerHTML = "";
  
        showSingleLesson(data.data);
      })
      .catch((error) => {
        lessonCards.innerHTML = `<div class="text-center py-10">Error loading data. Please try again.</div>`;
        console.error("Error fetching lesson data:", error);
      });
  }
  
  function showSingleLesson(data) {
    const lessonCards = document.getElementById("lesson-cards");
  
    lessonCards.innerHTML = "";
  
    if (data.length === 0 || !data) {
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
    } else {
      lessonCards.classList.add("grid", "grid-cols-3", "gap-7");
      data.forEach((singleLesson) => {
        const createDiv = document.createElement("div");
  
        createDiv.innerHTML = ` 
                      <div class="card bg-white hover:bg-slate-100">
        <div class="card-body items-center text-center">
          <h2 class="card-title">${
            !singleLesson.word ? "শব্দ পাওয়া যায়নি" : singleLesson.word
          }</h2>
          <p>Meaning / Pronunciation</p>
          <h2 class="card-title">${
            !singleLesson.meaning ? "অর্থ পাওয়া যায়নি" : singleLesson.meaning
          } / ${
          !singleLesson.pronunciation
            ? "উচ্চারন পাওয়া যায়নি"
            : singleLesson.pronunciation
        }</h2>
    
          <div class="w-full my-2 flex justify-between">
            <button onclick="loadModalData('${
              singleLesson.id
            }')" class="btn"><i class="fa-solid fa-circle-info"></i></button>
  
            <button id="microphone" onclick="pronounceWord('${
              singleLesson.word
            }')" class="btn"><i class="fa-solid fa-volume-high"></i></button>
          </div>
        </div>
  
      </div>
      
        
        `;
        lessonCards.append(createDiv);
      });
    }
  }
  
  function showData(data) {
    const lessonBtn = document.getElementById("lesson-btn");
  
    data.forEach((value) => {
      const createBtn = document.createElement("button");
      createBtn.className =
        "btn btnNew text-[#422AD5] border-[#422AD5] py-2 px-4 hover:bg-[#422AD5] hover:text-white";
      createBtn.innerHTML = `<i class="fa-solid fa-book-open"></i> lesson-${value.level_no}`;
  
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
  
  function loadModalData(id) {
    fetch(`https://openapi.programming-hero.com/api/word/${id}`)
      .then((res) => res.json())
      .then((data) => modalShow(data.data));
  }
  
  const modalShow = (data) => {
    console.log(data);
    const modal = document.getElementById("my_modal_5");
  
    modal.innerHTML = "";
    const createModal = document.createElement("div");
    createModal.innerHTML = `
                    <div class="modal-box w-full hover:bg-slate-50">
              <h3 class="text-2xl font-bold text-left">${
                data.word
              } (<i class="fa-solid fa-microphone-lines"></i>: ${
      data.pronunciation
    } )</h3>
              <h3 class="text-xm font-bold text-left pt-4">Meaning <br> <span class="font-light">${
                !data.meaning ? "অর্থ পাওয়া যায়নি" : data.meaning
              }</span></h3>
              <h3 class="text-xm font-bold text-left pt-4">Example <br> <span class="font-light">${
                !data.sentence ? "বাক্য পাওয়া যায়নি" : data.sentence
              }</span></h3>
              <h3 class="text-xm font-bold text-left pt-4">সমার্থক শব্দ গুলো <br> <span class="font-light">${
                !data.synonyms ? "সমার্থক শব্দ পাওয়া যায়নি" : data.synonyms
              }</span></h3>
              <div class="modal-action flex justify-start">
              <form method="dialog">
              <button class="btn w-full text-[#422AD5] border-[#422AD5] hover:bg-[#422AD5] hover:text-white">Complete Learning</button>
                 </form>
              </div>
            </div>
    `;
    modal.append(createModal);
  
    modal.showModal();
  };
  
  document.getElementById("faq-btn").addEventListener("click", (e) => {
    e.preventDefault();
  
    const faqSection = document.querySelector("#faq");
    faqSection.scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("learn-btn").addEventListener("click", (e) => {
    e.preventDefault();
  
    const learnSection = document.querySelector("#mainLearnSection");
    learnSection.scrollIntoView({ behavior: "smooth" });
  });
  
  function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN";
    window.speechSynthesis.speak(utterance);
  }

  loadData();
  document.getElementById('year').textContent = new Date().getFullYear();
  