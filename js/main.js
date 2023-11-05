import getRandomLine from "./poetry.js"

let timeTaken = 0
let timer
const userAnswer = document.getElementById('user-answer')
const testText = document.getElementById('test-text')
const highlight = document.getElementById('highlight')
let correctAnswers = 0
let incorrectAnswers = 0

/**Starts a 60 sec countdown and updates the innerHTMl every 1 sec.*/
function startTimer() {
    timer = setInterval(() => {
        if (timeTaken >= 61) {
            clearInterval(timer)
            console.log(correctAnswers, incorrectAnswers)
            computeStats()
        } else {
            document.getElementById('timer').innerHTML = 60 - timeTaken
            timeTaken += 1
        }        
    }, 1000)        
}

/**Initializes an await for random line to load and checks if line valid*/
async function initLine() {
    let result = await getRandomLine()
    while (result === undefined || result === '') {
        result = await getRandomLine()
    }
    testText.innerHTML = result    
}

function computeStats() {
    const totalAnswers = correctAnswers + incorrectAnswers
    const accuracy = correctAnswers * 100 / totalAnswers
    document.getElementById('stats').innerHTML = `Symbols per minute: ${totalAnswers.toFixed(3)}, Accuracy: ${accuracy.toFixed(3)}%`
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

        document.getElementById('stats').innerHTML = `+${correctAnswers}, -${incorrectAnswers}`
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




