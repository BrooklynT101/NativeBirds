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
    const card = document.createElement('div');
    card.className = 'bird_card';
    card.innerHTML = `
        <img src="${bird.photo.source}" alt="${bird.common_name}">
        <h3>${bird.original_name} \n(${bird.common_name})</h3>
        <p class="status ${bird.status.toUpperCase()}">${bird.status}</p>
        <p class="credit">Photo by: ${bird.photo.credit}</p>
    `;
    return card;
}

function sortBy(metric) {
    if (sort[metric]) {
        sortActions[metric];
    } else {
        console.error("Sorting function doesn't exist!")
    }
    console.fetchData
}

const sortActions = {
    name() {
        console.log("Hello World!");
    },

    weight() {
        console.log("Goodbye World!");
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
