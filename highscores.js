let highscore_list = document.querySelector("#highscore_list");
let highscores = JSON.parse(localStorage.getItem("highscores"));

// highscores.forEach((highscore) => {
//   const { user, score } = highscore;
//   let item = document.createElement("li");
//   item.classList.add("highscore");
//   item.textContent = `${user} -- ${score}`;
//   highscore_list.appendChild(item);
// });

highscore_list.innerHTML = highscores.map((highscore)=>{
  const { user, score } = highscore;
  return `<li class='highscore'> ${user} - ${score}</li>`
}).join("") 
