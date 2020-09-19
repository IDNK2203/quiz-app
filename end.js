let username = document.querySelector('#username')
let save_score = document.querySelector('#save_score')
let final_score = document.querySelector('#final_score')
let most_recent_score = localStorage.getItem("most_recent_score")

final_score.textContent = most_recent_score ;

// get or create an array of highscores
let highscores = JSON.parse(localStorage.getItem("highscores")) || []

username.addEventListener("keyup" , function(){
  save_score.disabled= !this.value;  
// console.log(this.value)
})

save_score.addEventListener("click" , e=>{
  e.preventDefault()
// create score object to be stored in highscore array
  let score ={
    score:most_recent_score,
    user:username.value
  }

// store score in highscore array
  highscores.push(score)

// sort highscore in descending other(from highest to lowest)
  highscores.sort((a,b ) => b.score - a.score)

// limit scores in highscore array to 5
  highscores.splice(5)

// score transformed array in local storage with a key of highscore
  localStorage.setItem("highscores" , JSON.stringify(highscores))
  window.location.assign("/")

}) 
console.log(highscores)