import getRandomLine from "./poetry.js"

let timeTaken = 0
let timer
const userAnswer = document.getElementById('user-answer')
const testText = document.getElementById('test-text')
const highlight = document.getElementById('highlight')
let correctAnswers = 0
let incorrectAnswers = 0
let results = loadStats()
let newestResults = []

/**Loads in and returns all stored results.*/
function loadStats() {
    const storedStats = JSON.parse(localStorage.getItem('results')) || []
    return storedStats
}

/**Starts a 60 sec countdown and updates the innerHTML every 1 sec.
 * Once timer stops runs stat processing functions.*/
function startTimer() {
    userAnswer.disabled = false
    timer = setInterval(() => {
        if (timeTaken >= 61) {
            clearInterval(timer)
            console.log(correctAnswers, incorrectAnswers)
            userAnswer.disabled = true
            computeStats()            
            updateTable()
        } else {
            document.getElementById('timer').innerHTML = 60 - timeTaken
            timeTaken += 1
        }        
    }, 1000)        
}

/**Initializes an await for random line to load and checks if line valid.*/
async function initLine() {

    let result = await getRandomLine()
    while (result === undefined || result === '') {
        result = await getRandomLine()
    }
    testText.innerHTML = result    
}

/**Adds newest round stats to the total results storage. Also stores newest stats in separate array.*/
function computeStats() {
    const totalAnswers = correctAnswers + incorrectAnswers
    const accuracy = parseInt((correctAnswers * 100 / totalAnswers).toFixed(3))
    
    document.getElementById('last-stats').innerHTML = `Symbols per minute: ${totalAnswers.toFixed(0)}, Accuracy: ${accuracy}%`
    
    let currentDate = new Date()

    results.push({
        date: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}`,
        spm: totalAnswers,
        accuracy: accuracy,
    })

    localStorage.setItem('results', JSON.stringify(results))

    newestResults.push({
        date: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}`,
        spm: totalAnswers,
        accuracy: accuracy,
    })

}
/**Takes in the newest results and adds them as a new row into the table.*/
function updateTable() {
    let table = document.getElementById('total-stats')

    if (newestResults) {
        for (const result of newestResults) {
            let newRow = table.insertRow(-1)
            let newDateElement = newRow.insertCell(0)
            let newSpmElement = newRow.insertCell(1)
            let newAccuracyElement = newRow.insertCell(2)

            newDateElement.textContent = result.date
            newSpmElement.textContent = result.spm
            newAccuracyElement.textContent = result.accuracy + '%'
        }
    }    
}
/**Loads in all of the historical stats from local storage and inserts them as rows into table.
 * Done once at the loading of the page.*/
function loadTable() {
    let table = document.getElementById('total-stats')
    const storedResults = JSON.parse(localStorage.getItem('results'))

    if (storedResults) {
        for (const result of storedResults) {
            let newRow = table.insertRow(-1)
            let newDateElement = newRow.insertCell(0)
            let newSpmElement = newRow.insertCell(1)
            let newAccuracyElement = newRow.insertCell(2)

            newDateElement.textContent = result.date
            newSpmElement.textContent = result.spm
            newAccuracyElement.textContent = result.accuracy + '%'
        }
    }    
}

function colorReact() { 
    const userText = userAnswer.value
    const testTextContent = testText.textContent   
    
    let coloredText = ''    

    for (let i = 0; i < Math.min(userText.length, testTextContent.length); i++) {
        if (userText.charAt(i) === testTextContent.charAt(i)) {
            coloredText += '<span style="background-color: rgb(102, 255, 153);">' + testTextContent.charAt(i) + '</span>'
        } else {
            coloredText += '<span style="background-color: #FFCCCB;">' + testTextContent.charAt(i) + '</span>'    
           
        }           
    }
    if (testTextContent.length > userText.length) {
        coloredText += testTextContent.substring(userText.length)
    } 
    testText.innerHTML = coloredText        
    
}
function currentWord() {
    const userText = userAnswer.value
    const testTextContent = testText.textContent
    const testTextArray = testTextContent.split(' ')
    let totalLengthBase = 0
    let currentWordIndex = 0  
    
    for (let i = 0; i < userText.length; i++) {
        let adjustedWordPos = testTextArray[currentWordIndex].length + totalLengthBase
      if (i < adjustedWordPos) {
        highlight.innerHTML = testTextArray[currentWordIndex]        
      } else {        
        totalLengthBase += testTextArray[currentWordIndex].length + 1
        currentWordIndex++
      }      
    }    
}


userAnswer.addEventListener('input', () => {
    if (!timer) {
        startTimer()
    }
    currentWord()    
    colorReact()
    if (userAnswer.value.length === testText.textContent.length) {
        const coloredSpans = testText.querySelectorAll('span')
        for (let i = 0; i < coloredSpans.length; i++) {
            let elementColor = window.getComputedStyle(coloredSpans[i]).getPropertyValue('background-color')
            if (elementColor === 'rgb(102, 255, 153)') {
                correctAnswers++
            } else {
                incorrectAnswers++
            }
        }

        document.getElementById('last-stats').innerHTML = `+${correctAnswers}, -${incorrectAnswers}`
        userAnswer.value = ''        
        initLine()        
    }    
})

document.getElementById('reset').addEventListener('click', () => {
    location.reload()
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
        location.reload()
    }
})
initLine()
loadTable()



