let birdData = []

async function fetchData() {
    try {
        const response = await fetch('data/nzbird.json');
        if (!response.ok) {
            throw console.error(response.status); // error handling
        }
        const data = await response.json()  // parse to JSON
        birdData = data;
        console.log(birdData); // use the data
        displayCards(birdData)
    } catch (error) {
        console.error('Could not fetch JSON data, error:', error)
    }
}

function displayCards(birds) {
    const gridContainer = document.getElementById('bird_grid');
    birds.forEach(bird => {
        const birdCard = createBirdCard(bird);
        gridContainer.appendChild(birdCard);
    });
}

function createBirdCard(bird) {
    // creating the card and naming it 
    const card = document.createElement('div');
    card.className = 'bird_card';

    //checking if there is an original name assc to the bird
    //creating variable for the display
    let nameDisplay;
    if (bird.original_name) {
        nameDisplay = `${bird.original_name}<br>(${bird.common_name})`;
    } else {
        nameDisplay = bird.common_name;
    }


    // inserting the values into the card from the data
    card.innerHTML = `
        <img src="${bird.photo.source}" alt="${bird.common_name}">
        <h3>${nameDisplay}</h3>
        <p class="status ${bird.status.toUpperCase()}">${bird.status}</p>
        <p class="credit">Photo by: ${bird.photo.credit}</p>
    `;
    return card;
}

function searchBirds() {
    const searchInput = document.getElementById('search');
    const query = removeDiacritics(searchInput.value.toLowerCase()); // get query and convert to lowercase for case-insensitive search

    //loop through the birds in the data, only adding those that match the search
    const filteredBirds = birdData.filter(bird => {
        //format the original and common name for case insensitivity and diacritic removal
        const orgName = removeDiacritics(bird.original_name.toLowerCase());
        const comName = removeDiacritics(bird.common_name.toLowerCase());

        //loop through the other names to find a match, assigning a check variable for truthy/falsey returns
        const otherNameCheck = bird.other_name.find(name =>
            removeDiacritics(name.toLowerCase()).includes(query)
        );

        //checks names against query and returns a true or false/falsey value
        return orgName.includes(query) || comName.includes(query) || otherNameCheck !== undefined;
        // //check the original/common/other names of each bird against the query to see if it matchs
        // // removes diatcritics for search then converts each to lower case for case insensitive searching
        // removeDiacritics(bird.original_name.normalize("NFD").toLowerCase()).includes(query) || //check 
        // removeDiacritics(bird.common_name.normalize("NFD").toLowerCase()).includes(query)

        // // bird.other_name.normalize("NFC").toLowerCase().includes(query)
    });

    //get and clear current display else it doubles
    const gridContainer = document.getElementById('bird_grid');
    gridContainer.innerHTML = '';

    //send filtered results to display function
    displayCards(filteredBirds);
}

// Function to remove diacritics with normilisation factor NFD and replacing the accent with nothing
function removeDiacritics(name) {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function sortBy(metric) {
    if (sortActions[metric]) {
        sortActions[metric]();
    } else {
        console.error("Sorting function doesn't exist!");
    }
}

const sortActions = {
    name() {
        console.error("Function has not been implemented...yet");
    },

    status() {
        console.error("Function has not been implemented...yet");
    },

    weight() {
        console.error("Function has not been implemented...yet");
    },

    length() {
        console.error("Function has not been implemented...yet");
    }
};

// const actions = {
//     greeting() {
//         console.log("Hello World!");
//     },

//     farewell() {
//         console.log("Goodbye World!");
//     }
// };

//call fetch data function when the page loads
window.onload = fetchData;
