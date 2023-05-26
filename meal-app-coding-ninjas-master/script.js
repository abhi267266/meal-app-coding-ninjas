const apiurl = "https://www.themealdb.com/api/json/v1/1/search.php";
const whenLetter = "?f=";
const whenWord = "?s=";
const whenId = "?i=";
const input = document.getElementById("input-item");
const cardContainer = document.getElementById('cardContainer');
const card = document.getElementsByClassName('card');

var listOfItems =  []; // Main list which will render in the HTML page
var wishList = []; // List to store selected items

// Populating the initial items on load
window.addEventListener('load', async (e) => {
  const apiUrlId = 'https://www.themealdb.com/api/json/v1/1/lookup.php';
  const whenId = "?i=";

  for (let i = 52772; i < 52792; i++) {
    try {
      const response = await fetch(apiUrlId + whenId + i);
      const data = await response.json(); // Get the JSON data from the response
      if (data.meals !== null) {
        const item = data.meals[0]; // Item is present in the 'meals' array
        listOfItems.push(item); // Add the item to the list
      }
    } catch (error) {
      console.log(error);
    }
  }

  creatingElement();
});

// Update the list and render it in the HTML
function updateList(list) {
  cardContainer.innerHTML = '';
  listOfItems = list;
  creatingElement();
}

// Handle input change event
input.addEventListener('input', async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
  const localList = [];
  try {
    let query = apiurl + whenWord +  input.value; 
    const response = await fetch(query);
    const data = await response.json();
    data.meals.forEach(element => {
      localList.push(element);
    });
    updateList(localList);
  } catch (error) {
    console.log(error);
  }
});

// Render items from listOfItems as a card in HTML
function createRow() {
  const row = document.createElement('div');
  row.classList.add('card-row');
  return row;
}

function createCard(title, description, imageUrl) {
  const card = document.createElement('div');
  card.classList.add('card');

  const image = document.createElement('img');
  image.classList.add('card-image');
  image.src = imageUrl;

  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = title;

  const cardText = document.createElement('p');
  cardText.classList.add('card-text');

  if (description.split(' ').length > 20) {
    const shortenedDescription = description.split(' ').slice(0, 20).join(' ');
    cardText.textContent = shortenedDescription + '...';
  } else {
    cardText.textContent = description;
  }

  const cardHeart = document.createElement('span');
  cardHeart.classList.add('card-heart');
  cardHeart.innerHTML = '<i class="far fa-heart"></i>'; // Heart icon

  cardHeart.addEventListener('click', () => {
    cardHeart.classList.toggle('active'); // Toggle the 'active' class for color change
    const index = wishList.indexOf(card);
    if (index === -1) {
      wishList.push(card);
    } else {
      wishList.splice(index, 1);
      cardContainer.innerHTML = "";
      creatingElement();
    }
  });

  card.appendChild(image);
  card.appendChild(cardTitle);
  card.appendChild(cardHeart);
  card.appendChild(cardText);

  card.addEventListener('click', () => {
    const box = document.getElementById('show-more-box');
    box.innerHTML = `
      <span id="close-box" onclick="closeBox()">X</span>
      <img src="${imageUrl}" class="box-image">
      <div class="box-content">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
    `;
    box.style.display = 'block';
  });

  return card;
}

function creatingElement() {
  const cardContainer = document.getElementById('cardContainer');
  const cardsPerRow = 5;
  let cardCounter = 0;
  let currentRow = null;

  if (listOfItems.length > 0) {
    listOfItems.forEach((item) => {
      const card = createCard(item.strMeal, item.strInstructions, item.strMealThumb);

      if (cardCounter % cardsPerRow === 0) {
        currentRow = createRow();
        cardContainer.appendChild(currentRow);
      }

      currentRow.appendChild(card);
      cardCounter++;
    });
  }
}

// Close the box
function closeBox() {
  const box = document.getElementById('show-more-box');
  box.style.display = 'none';
}

// Toggle the slider menu
const toggleMenu = document.getElementById('toggle-menu');
const sliderSection = document.getElementById('slider-section');

toggleMenu.addEventListener('click', () => {
  sliderSection.classList.add('active');
  toggleMenu.style.display = 'none';
  populatingSliderMenu();
});

const closeSlider = document.querySelector('.close-slider');
closeSlider.addEventListener('click', () => {
  sliderSection.classList.remove('active');
  toggleMenu.style.display = 'block';
});

// Populate the slider menu with items from the wish list
function populatingSliderMenu() {
  const parentDiv = document.getElementById('to-populate-wishList');
  if (wishList.length === 0) {
    parentDiv.innerHTML = '<p style="color: white; font-size: 20px; ">No items in wishlist</p>';
    return;
  }
  parentDiv.innerHTML = "";
  wishList.forEach((card) => {
    card.style.width = '70%';
    card.style.marginLeft= '75px';
    card.style.marginTop = '20px';
    card.style
    parentDiv.appendChild(card);
  });
}
