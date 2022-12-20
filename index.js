// section to target Dom Element
const mealsEl = document.querySelector("#meals");
const ulEl = document.querySelector(".fav-meal");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.querySelector(".search");

const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup");

// to get  random meal
async function getMeals() {
  const url = "https://www.themealdb.com/api/json/v1/1/random.php";
  const meals = await fetch(url);
  const res = await meals.json();
  //   console.log(res);
  const mealData = res.meals[0];
  //   console.log(mealData);
  loadFavMeals(mealData, true);
}

// to fetch by id

async function getMealId(id) {
  //   const url = `"www.themealdb.com/api/json/v1/1/lookup.php?i="${id}`;
  const respData = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const resp = await respData.json();
  const meal = resp.meals[0];
  //   console.log(meal);

  return meal;
}
// get meal by search
async function getMealSearch(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );

  const respData = await resp.json();
  const meals = respData.meals;
  console.log(meals);
  return meals;
}

function loadFavMeals(mealData, random = false) {
  let contentDiv = document.createElement("div");
  contentDiv.classList.add("meal");
  contentDiv.innerHTML = `
          <div class="meal-header">
          ${
            random
              ? `
            <span class="random"> Random Recipe </span>`
              : ""
          }
            <img
              src="${mealData.strMealThumb}"
              alt="${mealData.strMeal}"
            />
          </div>
          <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn" >
              <i class="fas fa-heart"></i>
            </button>
          </div>
        `;
  mealsEl.appendChild(contentDiv);
  const favBTN = document.querySelector(".meal-body .fav-btn");
  favBTN.addEventListener("click", () => {
    const mealIds = mealData.idMeal;
    // console.log("hello");
    // e.target.classList.toggle("active");
    if (favBTN.classList.contains("active")) {
      removeMealFromLs(mealIds);
      favBTN.classList.remove("active");
    } else {
      setMealFromLs(mealIds);
      favBTN.classList.add("active");
    }
    fetchFavMeal();
  });
  contentDiv.addEventListener("click", () => {
    showpop(mealData);
  });
}

// get mealIds from Local storage

function getMealFromLs() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

// set item to localstorage
function setMealFromLs(mealId) {
  let oldIds = getMealFromLs();
  localStorage.setItem("mealIds", JSON.stringify([...oldIds, mealId]));
}
// remove from local storage

function removeMealFromLs(mealId) {
  let oldIds = getMealFromLs();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(oldIds.filter((id) => id !== mealId))
  );
}
// get data from the local storage and populate the favourit meal section
function favMeal(mealData) {
  let li = document.createElement("li");
  li.innerHTML = `
            <img
              src=${mealData.strMealThumb}
              alt=${mealData.strMeal}
            />
            <span>${mealData.strMeal}</span>
            <button class="clear"><i class="fas fa-window-close"></i></button>
          `;

  const clearEl = li.querySelector(".clear");

  clearEl.addEventListener("click", () => {
    removeMealFromLs(mealData.idMeal);
    fetchFavMeal();
  });
  ulEl.appendChild(li);
  ulEl.addEventListener("click", () => {
    showpop(mealData);
  });
}
// loop thru localstorage and get the stored ID and fetch by the ID
async function fetchFavMeal() {
  ulEl.innerHTML = "";
  const mealIds = getMealFromLs();
  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealId(mealId);

    favMeal(meal);
  }
}

// search bar functionality

searchBtn.addEventListener("click", async () => {
  mealsEl.innerHTML = "";
  const search = searchTerm.value;
  console.log(search);

  const meals = await getMealSearch(search);
  if (meals) {
    meals.forEach((meal) => {
      return loadFavMeals(meal);
    });
  }
});

// popup close function

popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
// show popup function

function showpop(mealData) {
  mealInfoEl.innerHTML = "";
  let arr = [];
  for (let i = 1; i <= 20; i++) {
    let index = mealData["strIngredient" + i];
    if (index) {
      arr.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }
  const content = document.createElement("div");

  content.innerHTML = ` <h1>${mealData.strMeal}</h1>
          <img
            src=${mealData.strMealThumb}
            alt=${mealData.strMeal}
          />
          <p>${mealData.strInstructions}</p>
        <h3>Ingredients:</h3>

          <ul>
            ${arr
              .map(
                (ing) => `
            <li>${ing}</li>
            `
              )
              .join("")}
          </ul>`;
  mealInfoEl.appendChild(content);
  mealPopup.classList.remove("hidden");
  console.log(arr);
  //   console.log("hel");
}
// loop thru the mealData instruction

// function instruction(mealData) {
//   for (let i = 0; i < 20; i++) {
//     const index = mealData["strIngredient" + i];
//     if (mealData["strIngredient" + i]) {
//       arr.push(
//         `${mealData["strIngredient" + i]}-${mealData["strMeasure" + i]}`
//       );
//     } else {
//       break;
//     }
//   }
//   //   return arr;
// }
// function calls
getMeals();
fetchFavMeal();
