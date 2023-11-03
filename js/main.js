import getRandomLine from "./poetry.js"

let timeTaken = 0
let timer
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

document.getElementById('user-answer').addEventListener('input', () => {
    if (!timer) {
        startTimer()
    }
})

document.getElementById('test-text').innerHTML = getRandomLine()

