import getRandomLine from "./poetry.js"

let timeTaken = 0
let timer
let correctAnswers = 0
let incorrectAnswers = 0
let results = loadStats()
let newestResults = []

const userAnswer = document.getElementById('user-answer')
const testText = document.getElementById('test-text')
const highlight = document.getElementById('highlight')

/**Initializes an await for random line to load and checks if line valid.*/
async function initLine() {

    let result = await getRandomLine()
    while (result === undefined || result === '') {
        result = await getRandomLine()
    }
    document.getElementById('timer').innerHTML = 60
    testText.innerHTML = result    
}

/**Starts a 60 sec countdown and updates the innerHTML every 1 sec.
 * Once timer stops runs stat processing functions.*/
function startTimer() {
    userAnswer.disabled = false
    timer = setInterval(() => {
        if (timeTaken >= 61) {
            clearInterval(timer)            
            userAnswer.disabled = true
            validityCalculator()
            computeStats()            
            updateTable()
            let averageSpm, averageAccuracy
            [averageSpm, averageAccuracy] = getAverageStats()
            checkProgress(averageSpm, averageAccuracy)
        } else {
            document.getElementById('timer').innerHTML = 60 - timeTaken
            timeTaken += 1
        }        
    }, 1000)        
}

/**Changes currently typed character to green or red based if input corresponds to
 * provided character from the text.*/
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

/**Prints the current word being typed out based on length. If current position of user input
 * is less than the current test word position, it will highlight the current test word.
 * If input position is further on, then it will move the current word index up one step and repeat the process.  
 */
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
        totalLengthBase += testTextArray[currentWordIndex].length + 1 //+1 is to account for spaces.
        currentWordIndex++
      }      
    }    
}

/**Calculates the amount of correct and incorrect answers of a line.*/
function validityCalculator() {
    const coloredSpans = testText.querySelectorAll('span')
        for (let i = 0; i < coloredSpans.length; i++) {
            let elementColor = window.getComputedStyle(coloredSpans[i]).getPropertyValue('background-color')
            if (elementColor === 'rgb(102, 255, 153)') {
                correctAnswers++
            } else {
                incorrectAnswers++
            }
        }
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
            newAccuracyElement.textContent = +result.accuracy.toFixed(2) + '%'
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

/**Calculates average stats by taking all results from local storage and looping over each element. */
function getAverageStats() {
    let table = document.getElementById('average-stats')
    const storedResults = JSON.parse(localStorage.getItem('results'))
    let totalSpm = 0
    let totalAccuracy = 0
    if (storedResults) {
        let i = 0
        for (const result of storedResults) {            
            totalSpm += result.spm
            totalAccuracy += result.accuracy
            i++            
        }
        let averageSpm = +(totalSpm / i).toFixed(0)
        let averageAccuracy = +(totalAccuracy / i).toFixed(2)
        document.getElementById('spm').textContent = averageSpm
        document.getElementById('acc').textContent = averageAccuracy + '%'

        return [averageSpm, averageAccuracy]
    } 
}

/**Calculates the most recent performance in proportion to the average, and returns comparison. */
function checkProgress(averageSpm, averageAccuracy) {
    const progress = document.getElementById('progress')    
    const totalAnswers = +(correctAnswers + incorrectAnswers).toFixed(0)
    const accuracy = +(correctAnswers * 100 / totalAnswers).toFixed(2)

    const spmProportion = 100 * totalAnswers / averageSpm
    const accuracyProportion = 100 * accuracy / averageAccuracy
    

    if (totalAnswers > averageSpm) {
        const spmResult = +(spmProportion - 100).toFixed(2)
        progress.innerHTML = `Your SPM is ${spmResult}% better than average!`
    }   else if (totalAnswers < averageSpm) {        
        const spmResult = +(100 - spmProportion).toFixed(2)
        progress.innerHTML = `Your SPM is ${spmResult}% worse than average...`
    } else if (totalAnswers === averageSpm) {
        progress.innerHTML = 'Your SPM is dead average.'
    }

    if (accuracy > averageAccuracy) {        
        const accuracyResult = +(accuracyProportion - 100).toFixed(2)
        progress.innerHTML += ` Your accuracy is ${accuracyResult}% better than average!`
    } else if (accuracy < averageAccuracy) {        
        const accuracyResult = +(100 - accuracyProportion).toFixed(2)
        progress.innerHTML += ` Your accuracy is ${accuracyResult}% worse than average...`
    } else if (totalAnswers === averageSpm) {
        progress.innerHTML += ' Your accuracy is dead average.'
    }
}

/**Loads in and returns all stored results.*/
function loadStats() {
    const storedStats = JSON.parse(localStorage.getItem('results')) || []
    return storedStats
}

/**Adds newest round stats to the total results storage. Also stores newest stats in separate array.*/
function computeStats() {
    const totalAnswers = +(correctAnswers + incorrectAnswers).toFixed(0)
    const accuracy = +(correctAnswers * 100 / totalAnswers).toFixed(2)
    
    document.getElementById('last-stats').innerHTML = `Symbols per minute: ${totalAnswers}, Accuracy: ${accuracy}%`
    
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

userAnswer.addEventListener('input', () => {
    if (!timer) {
        startTimer()
    }
    currentWord()    
    colorReact()
    if (userAnswer.value.length === testText.textContent.length) {
        validityCalculator()

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
getAverageStats()



