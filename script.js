async function fetchData() {
    try {
        const response = await fetch('https://website.com/file.json');
        if (!response.ok) {
            throw new console.error(response.status); // error handling
        }
        const data = response.json()  // parse to JSON
        console.log(data); // use the data
        displayCards(data)
    } catch (error) {
        console.error('Could not fetch JSON data, error:', error)
    }
}

function displayCards(birds) {

}

function createBirdCard(bird) {

}

