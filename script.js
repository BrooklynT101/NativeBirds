let birdData = []

// statuses and their corrosponding colors
const statusColors = {
    "Not Threatened": "#02a028",
    "Naturally Uncommon": "#649a31",
    "Relict": "#99cb68",
    "Recovering": "#fecc33",
    "Declining": "#fe9a01",
    "Nationally Increasing": "#c26967",
    "Nationally Vulnerable": "#9b0000",
    "Nationally Endangered": "#660032",
    "Nationally Critical": "#320033",
    "Extinct": "black",
    "Data Deficient": "black"
};

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
    // get dom
    const gridContainer = document.getElementById('bird_grid');

    //clear current display
    gridContainer.innerHTML = '';

    //add birds
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
        nameDisplay = `<br>${bird.common_name}<br> `;
    }

    //endangerment status color sourcing
    const statusColor = statusColors[bird.status] || 'black' //default to black if theres no data

    // inserting the values into the card from the data
    card.innerHTML = `
        <div class="image-container">   
            <img src="${bird.photo.source}" alt="${bird.common_name}">
            <div class="credit-overlay">Credit: ${bird.photo.credit}</div>
        </div>
        <h3>${nameDisplay}</h3>
        <div class="status-bar" style="background-color: ${statusColor};"></div>
        <p>Order: ${bird.order}</p>
        <p>Family: ${bird.family}</p>
        <p class="size-info">Average Length: ${bird.length}</p>
        <p class="size-info">Average Weight: ${bird.weight}</p> 
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
    });

    //send filtered results to display function
    displayCards(filteredBirds);
}

// Function to remove diacritics with normilisation factor NFD and replacing the accent with nothing
function removeDiacritics(name) {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function sortBy(metric) {
    //if the action doesnt exist it should create an error and return
    if (!sortActions[metric]) {
        console.error("Sorting function doesn't exist!");
        return;
    }

    //sort bird data based off of specified sorting metric (e.g., weight or status)
    birdData.sort(sortActions[metric]);

    displayCards(birdData);
}

const sortActions = {
    //function to sort the bird by name, used common name as not all bird had a Maori eqv
    name(a, b) {
        return a.common_name.localeCompare(b.common_name);
    },

    //function to sort by status, defining by a status ranking system of endangerment 
    status(a, b) {
        //get the ranks to compare
        const rankA = getStatusRank(a.status);
        const rankB = getStatusRank(b.status);

        //compare ranks to determine the order
        return rankA - rankB;
    },

    weight(a, b) {
        //get the weights to compare
        const weightA = parseInt(a.weight, 10);
        const weightB = parseInt(b.weight, 10);

        //compare weights to determine the order
        return weightA - weightB;
    },

    length(a, b) {
        //get the lengths to compare
        const lengthA = parseInt(a.length, 10);
        const lengthB = parseInt(b.length, 10);

        //compare lengths to determine the order
        return lengthA - lengthB;
    }
};

//function to define and return the rank of a given status, from least to most critical
function getStatusRank(status) {
    const statusOrder = [
        "Not Threatened",
        "Naturally Uncommon",
        "Relict",
        "Recovering",
        "Declining",
        "Nationally Increasing",
        "Nationally Vulnerable",
        "Nationally Endangered",
        "Nationally Critical",
        "Extinct",
        "Data Deficient"
    ];
    return statusOrder.indexOf(status);
}

function createLegend() {
    const legendContainer = document.getElementById('status-legend');
    legendContainer.innerHTML = ''; //clear existing content first

    for (const status in statusColors) {
        const color = statusColors[status];
        const legendElement = document.createElement('div');
        legendElement.classList.add('legend-element');

        legendElement.innerHTML = `
        <p class="status-label">${status}</p>
        <div class="color-box" style="background-color: ${color};"></div>
        `
        legendContainer.appendChild(legendElement);
    }
}

//call fetch data function when the page loads
window.onload = fetchData(), createLegend();
