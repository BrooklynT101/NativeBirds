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
        console.log("Fetched bird data:", birdData); // use the data
        displayCards(birdData)
    } catch (error) {
        console.error('Could not fetch JSON data, error:', error)
    }
}

function displayCards(birds) {
    // get dom
    const gridContainer = document.getElementById('bird_grid');
    const birdCount = document.getElementById('birdCount');

    //clear current display
    gridContainer.innerHTML = '';

    // Update bird count
    searchCount.textContent = `Search Results: ${birds.length}`;

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
        <div class="status-bar" style="background-color: ${statusColor}"; title="${bird.status}";></div>
        <p><strong>Scientific Name:</strong> ${bird.scientific_name}</p>
        <p><strong>Order:</strong> ${bird.order}</p>
        <p><strong>Family:</strong> ${bird.family}</p>
        <p class="size-info"><strong>Average Length:</strong> ${bird.length}</p>
        <p class="size-info"><strong>Average Weight:</strong> ${bird.weight}</p> 
    `;
    return card;
}

function applyFilter() {
    const searchInput = document.getElementById('search');
    const query = removeDiacritics(searchInput.value.toLowerCase()); // get query and convert to lowercase for case-insensitive search
    const sortingMetric = document.getElementById('sortByBox').value;
    const order = document.getElementById('orderByBox').value;

    //loop through the birds in the data, only adding those that match the search
    let filteredBirds = birdData.filter(bird => {
        //create an array for the bird names
        let birdNames = [];
        //format and add the various names for case insensitivity and diacritic removal
        birdNames.push(removeDiacritics(bird.original_name.toLowerCase()));
        birdNames.push(removeDiacritics(bird.common_name.toLowerCase()));
        birdNames.push(removeDiacritics(bird.scientific_name.toLowerCase()));
        birdNames.push(removeDiacritics(bird.order.toLowerCase()));
        birdNames.push(removeDiacritics(bird.family.toLowerCase()));

        // check if any name matches the query
        const nameCheck = birdNames.some(name => name.includes(query));

        //loop through the other names to find a match, assigning a check variable for truthy/falsey returns
        const otherNameCheck = bird.other_name.find(name =>
            removeDiacritics(name.toLowerCase()).includes(query)
        );

        //checks names against query and returns a true or false/falsey value
        return nameCheck || otherNameCheck !== undefined;
    });

    //sort the filtered birds by defined order
    filteredBirds = sortBy(filteredBirds, sortingMetric, order);
    //send filtered results to display function
    displayCards(filteredBirds);
}

// Function to remove diacritics with normilisation factor NFD and replacing the accent with nothing
function removeDiacritics(name) {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function sortBy(birds, metric, order) {
    //if the action doesnt exist it should log an error and return
    if (!sortActions[metric]) {
        console.error("Sorting function doesn't exist! Tried to sort by: ", metric);
        return;
    }
    const sortedBirds = birds; // create new array as not to mess with the original one

    //sort bird data based off of specified sorting metric (e.g., weight or status)
    sortedBirds.sort(sortActions[metric]);
    // console.log("Sorted bird array:",sortedBirds);
    if (order === "descending") sortedBirds.reverse();
    return sortedBirds;
}

const sortActions = {
    //function to sort the bird by name, used common name as not all bird had a Maori eqv
    name(a, b) {
        return a.common_name.localeCompare(b.common_name);
    },

    //function to sort the bird by scientific_name
    scientificName(a, b) {
        return a.scientific_name.localeCompare(b.scientific_name);
    },

    //function to sort the bird by name, used common name as not all bird had a Maori eqv
    orderName(a, b) {
        return a.order.localeCompare(b.order);
    },

    //function to sort the bird by name, used common name as not all bird had a Maori eqv
    familyName(a, b) {
        return a.family.localeCompare(b.family);
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
        const weightA = parseWeight(a.weight, 10);
        const weightB = parseWeight(b.weight, 10);

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

/*
Function to add more consistency to the weight, converting units and eliminating ranges
*/
function parseWeight(weightString) {
    // split the weight string from the json into parts
    const parts = weightString.split(' ');
    let weights = [];
    // boolean for if the units are kg
    let isKg = weightString.includes('kg');

    //iterate over each part
    for (let part of parts) {
        let value = parseFloat(part);
        if (!isNaN(value)) {
            if (isKg) {
                value *= 1000; // Convert kg to grams
            }
            weights.push(value);
        }
    }

    //return the smallest of the weights present
    return Math.min(...weights);
}

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

// function to create the interactive legend
function createLegend() {
    const legendContainer = document.getElementById('status-legend');
    legendContainer.classList.add('legend-container'); // Add a class to the legend container
    legendContainer.innerHTML = ''; //clear existing content first

    //loop over every color
    for (const status in statusColors) {
        const color = statusColors[status];
        const legendElement = document.createElement('div');
        legendElement.classList.add('legend-element');

        //inserting html
        legendElement.innerHTML = `
        <p class="status-label">${status}</p>
        <div class="color-box" style="background-color: ${color}"; cursor: "pointer"; title="View all ${status} birds." onclick="filterByStatus('${status}')"; ></div>
        `
        //adding legend to the legend box
        legendContainer.appendChild(legendElement);
    }
}

// function to filter the bird by status
function filterByStatus(status) {
    const filteredBirds = birdData.filter(bird => bird.status === status);
    displayCards(filteredBirds);
}

//call fetchData and createLegend functions when the page loads
window.onload = fetchData(), createLegend();
