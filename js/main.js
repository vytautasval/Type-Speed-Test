import getRandomLine from "./poetry.js"

let timeTaken = 0
let timer
const userAnswer = document.getElementById('user-answer')
const testText = document.getElementById('test-text')
const highlight = document.getElementById('highlight')

/**Starts a 60 sec countdown and updates the innerHTMl every 1 sec.*/
function startTimer() {
    timer = setInterval(() => {
        if (timeTaken >= 61) {
            clearInterval(timer)
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

function colorReact() { 
    const userText = userAnswer.value
    const testTextContent = testText.textContent   
    let coloredText = ''
    for (let i = 0; i < Math.min(userText.length, testTextContent.length); i++) {
        if (userText.charAt(i) === testTextContent.charAt(i)) {
            coloredText += '<span style="background-color: #66FF99;">' + testTextContent.charAt(i) + '</span>'
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
      if (i < (testTextArray[currentWordIndex].length + totalLengthBase)) {
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
    
})

initLine()




