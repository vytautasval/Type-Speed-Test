/**Fetches random title and returns it.*/
async function getRandomTitle() {    
    const response = await fetch('https://poetrydb.org/author/Oscar%20Wilde/title')
    const totalTitles = await response.json()

    randomTitle = Math.floor(Math.random() * totalTitles.length)      
    return totalTitles[randomTitle]['title']
}

/**Fetches selected poetry and returns it.*/
async function getPoetry() {
    const title = await getRandomTitle()
    const response = await fetch(`https://poetrydb.org/title/${title}/lines.json`)
    const poetry = await response.json()
    return poetry
}

/**Returns a random line of poetry from getPoetry() function */
async function getRandomLine() {
    const poetry = await getPoetry();
    const randomLine = Math.floor(Math.random() * poetry[0]['lines'][0].length)

    const result = poetry[0]['lines'][randomLine]
    console.log(result)
}

getRandomLine();
