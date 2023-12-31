/**Fetches random title and returns it.*/
 async function getRandomTitle() {    
    const response = await fetch('https://poetrydb.org/author/Oscar%20Wilde/title')
    const totalTitles = await response.json()

    const randomTitle = Math.floor(Math.random() * totalTitles.length)      
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
export default async function getRandomLine() {
    try {
        const poetry = await getPoetry();
        const randomLine = Math.floor(Math.random() * poetry[0]['lines'][0].length)
        const result = poetry[0]['lines'][randomLine]    
        return result
    } catch (error) {
        document.getElementById('test-text').style.color = 'red'
        document.getElementById('test-text').textContent = 'An error has occured. Reloading.'
    }
}

