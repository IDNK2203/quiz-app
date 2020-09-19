// hooks
let question = document.querySelector("#question");
let choices = Array.from(document.querySelectorAll(".choice-text"));
let progress_text = document.querySelector(".progress_text");
let score_text = document.querySelector("#score");
let progress_bar = document.querySelector("#progress_bar");
let inner_progress_bar = document.querySelector("#inner_progress_bar");
let page_content = document.querySelector('#game')
let loader = document.querySelector('#loader')

// variables
let current_Question;
let accepting_Answers = false;
let score = 0;
let question_counter = 0;
let avaliable_questions = [];
let questions = [];

// #constants
const correct_bonus = 10;
const max_question = 5;

// fetch questions
fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then((response) => response.json())
  .then((data) => {
    //transform response result array into an array of question objs
    // the keys of the obj should be the qusetion, question choices and an answer
    questions = data.results.map((result) => {
      // create questions object
      const question_obj = {
        question: result.question,
      };

      // first store the incorrect answers in a array called loaded choices
      let loaded_choices = [...result.incorrect_answers];

      // generate a random integer in the closed interval [1 , 4] and
      //  set question_obj answer property to equal that random number
      question_obj.answer = Math.floor(Math.random() * 4) + 1;

      // place the result.correct_answer vlaue in the loaded choice array in an index
      // one less than the question_obj.answer value.
      loaded_choices.splice(question_obj.answer - 1, 0, result.correct_answer);

      //loop over the item in the loaded choice array
      loaded_choices.forEach((choice, index) => {
        // for each array item create a new key/value pair in question_obj 
        // set the key to the string "choice (index +1)" and the value to the array item.
        question_obj["choice" + (index + 1)] = choice;
      });
      return question_obj;
    });

    start_game();
  })
  .catch((e) => console.error(e));

// start game function containes initial setting of game 
let start_game = () => {
  score = 0;
  question_counter = 0;
  avaliable_questions = [...questions];
  loader.classList.add("hidden")
  page_content.classList.remove("hidden")

  get_next_question();
};

let get_next_question = () => {
  // if user finishs answering questions take user to the game ended page.
  if (avaliable_questions.length === 0 || question_counter >= max_question) {
    localStorage.setItem("most_recent_score", score);
    return window.location.assign("/end.html");
  }

  // update question timer and inner progress bar
  question_counter++;
  inner_progress_bar.style.width = `${
    (question_counter / max_question) * 100
  }%`;

  // update progress text and pick a random question then display it
  progress_text.textContent = `Question ${question_counter}/${max_question}`;
  const question_index = Math.floor(Math.random() * avaliable_questions.length);
  current_Question = avaliable_questions[question_index];
  question.textContent = current_Question.question;

  // loop over choices and update them
  choices.forEach((choice) => {
    const choice_value = current_Question["choice" + choice.dataset["number"]];
    choice.textContent = choice_value;
  });

  //remove displayed question from avaliable questions array and set accepting questions to true
  avaliable_questions.splice(question_index, 1);
  accepting_Answers = true;
};

// loop over choices and add an evenlistener to each of them .
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    // if accepting answer is set to false return out of function
    if (!accepting_Answers) {
      return;
    }

    // create function update score
    let update_score = (num) => {
      // if  class to apply is correct update score else, return out of function
      if (class_to_apply == "correct") {
        score += num;
        score_text.textContent = score;
      }
      return;
    };

    // store the selected choice , get its dataset number property and get anser from the current questions array
    const selected_choice = e.target;
    const selected_answer = selected_choice.dataset["number"];
    const answer = current_Question.answer;
    console.log(typeof selected_answer, typeof answer);

    // if selected choice is equal to answer set class to apply to correct else set to incorrect and
    // and add the class class_to_apply to the selected choice parent element.
    const class_to_apply = selected_answer == answer ? "correct" : "incorrect";
    update_score(correct_bonus);
    choice.parentElement.classList.add(class_to_apply);

    //  set accepting answers to false
    accepting_Answers = false;

    // set a delay of 1 second and then remove the class class_to_apply from selected choice parent element.
    // call the get next question function .
    setTimeout(() => {
      choice.parentElement.classList.remove(class_to_apply);
      get_next_question();
    }, 1000);
  });
});
