const apiurl = "https://www.themealdb.com/api/json/v1/1/search.php";
const whenLetter = "?f=";
const whenWord ="?s=";
const whenId = "?i=";
const input = document.getElementById("input-item");
const cardContainer = document.getElementById('cardContainer');

var listOfItems =  [];      //main list which will render in the html page

var count = 0;


//this is populating the intial items on load

function updateList(list){

  listOfItems = []
  listOfItems = list;
  creatingElement()


}

window.addEventListener('load', async (e) => {
    const apiUrlId = 'https://www.themealdb.com/api/json/v1/1/lookup.php';
    const whenId = "?i=";
  
    for (let i = 52772; i < 52792; i++) {
      try {
        const response = await fetch(apiUrlId + whenId + i);
        const data = await response.json(); // Get the JSON data from the response
        if (data.meals !== null) {
          const item = data.meals[0]; // item is present in the 'meals' array
          listOfItems.push(item); // Add the item to the list
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    creatingElement();
  });




  
//this is when the user is entering after writing full query

input.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission behavior
  
      try {
        let qurey = apiurl + whenWord +  input.value; 
        const response = await fetch(qurey);
        const data = await response.json();
        const localList = [];
        data.meals.forEach(element => {
            localList.push(element);
        });
        updateList(localList);
        } catch (error) {
        console.log(error);
        }
    }   
  });
  



//this for suggestion while every keydown

input.addEventListener('keydown', async (event)=>{

    const allowedKeys = 'abcdefghijklmnopqrstuvwxyz';
    const keyPressed = event.key.toLowerCase();
        if (allowedKeys.includes(keyPressed) ) {
            try {
                let qurey = apiurl + whenLetter +  keyPressed; 
                const response = await fetch(qurey);
                const data = await response.json();
                const localList = [];
                data.meals.forEach(element => {
                    localList.push(element);
                });
                listOfItems = localList;
                creatingElement()
                count+=1;    
                } catch (error) {
                console.log(error);
                }
            }
});

//render items from listOfitem as a card in html

function creatingElement(){
  const cardContainer = document.getElementById('cardContainer');
  const cardsPerRow = 5;
  let cardCounter = 0;
  let currentRow = null;
  listOfItems.forEach((item) => {
    const card = createCard(item.strMeal, item.strInstructions);
  
    if (cardCounter % cardsPerRow === 0) {
      currentRow = createRow();
      cardContainer.appendChild(currentRow);
    }
  
    currentRow.appendChild(card);
    cardCounter++;
  });

}

function createRow() {
  const row = document.createElement('div');
  row.classList.add('card-row');
  return row;
}

function createCard(title, description) {
  const card = document.createElement('div');
  card.classList.add('card');

  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = title;

  const cardText = document.createElement('p');
  cardText.classList.add('card-text');

  if (description.split(' ').length > 20) {
    const shortenedDescription = description.split(' ').slice(0, 20).join(' ');
    cardText.textContent = shortenedDescription + '...';
    cardText.addEventListener('click', () => {
      cardText.textContent = description;
    });
    cardText.classList.add('show-more');
  } else {
    cardText.textContent = description;
  }

  card.appendChild(cardTitle);
  card.appendChild(cardText);

  return card;
}
    





