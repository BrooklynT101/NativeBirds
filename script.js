async function fetchData() {
    try {
        const response = await fetch('data/nzbird.json');
        if (!response.ok) {
            throw console.error(response.status); // error handling
        }
        const data = await response.json()  // parse to JSON
        console.log(data); // use the data
        displayCards(data)
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

function sortByAttribute() {

}

//call fetch data function when the page loads
window.onload = fetchData;
