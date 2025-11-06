// time
date.textContent = time();

// global variables/constants
let score, answer, level, totalTime, recordTime; 
let totalTimeAllRounds = 0;
let attempts = 0;
const levelArr = document.getElementsByName("level");
const scoreArr = [];

// event listeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);
nameBtn.addEventListener("click", obtainName);

let finalName = "";

function obtainName(){
    let nameValue = document.getElementById("nameInput").value;
    if(nameValue == ""){
        nameParagraph.textContent = "Invalid Name. Try again.";
    } 
    else {
        nameValue = nameValue.charAt(0).toUpperCase() + (nameValue.slice(1)).toLowerCase();
        nameBtn.disabled = true;
        nameInput.disabled = true;
        nameInput.value = "";
        nameParagraph.textContent = "Welcome, " + nameValue;
        finalName = nameValue;
        for(let i=0;i<levelArr.length;i++){
        levelArr[i].disabled = false;
        }
        playBtn.disabled = false;
    }
    
    }

function time(){
    let d = new Date();
    // concatenate the date and time
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    suffix = ["st", "nd", "rd", "th"]
    let addSuffix

    if (d.getDate() % 10 == 1){
        addSuffix = suffix[0]
    }
    else if (d.getDate() % 10 == 2){
        addSuffix = suffix[1]
    }
    else if (d.getDate() % 10 == 3){
        addSuffix = suffix[2]
    }
    else {
        addSuffix = suffix[3]
    }

    let str = months[d.getMonth()] + " " + d.getDate() + addSuffix+ ", " + d.getFullYear();

    let actualTime
    let hours

    if (d.getHours() < 12){
        timeEnding = " AM"
    } else {
        timeEnding = " PM"
    }

    if (d.getHours() == 0 || d.getHours() == 12){
        hours = "12"
    }
    else {
        hours = ((d.getHours()%12).toString()).padStart(2, "0")
    }

    timeParagraph.textContent = hours + ":" + (d.getMinutes().toString()).padStart(2, "0") + ":" + (d.getSeconds().toString()).padStart(2, "0") + "." + (d.getMilliseconds().toString()).padStart(3, "0") + timeEnding

    return str;
}

setInterval(time, 1);

function getTime(start){
    
    let difference
    updatedTime = new Date().getTime();
    difference = updatedTime - start
    totalTime = difference

    hours = String(Math.floor(difference/(1000*60*60))).padStart(2, "0")
    minutes = String(Math.floor(difference/(1000*60))%60).padStart(2, "0")
    seconds = String(Math.floor(difference/(1000))%60).padStart(2, "0")

    roundTime.textContent = "Round Timer: " + hours + ":" + minutes + ":" + seconds
}


function play(){

    let startTime = new Date().getTime();

    playBtn.disabled = true;
    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    guess.disabled = false;

    timer = setInterval(() => {
    getTime(startTime);
  }, 1);

    for(let i=0;i<levelArr.length;i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
    }
    
    answer = Math.floor(Math.random()*level)+1;
    msg.textContent = "Guess A Number Between 1-" + level + ", " + finalName;
    guess.placeholder = answer + ", I kept this so you could test";;
    score = 0;



}

function makeGuess(){
    let userGuess = parseInt(guess.value);
    let scoreDetermination
    let advice
    
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "INVALID, Guess A Number, "+ finalName + "!"
        return;
    }
    score++;

    if(levelArr[0].checked){
        if (Math.abs(userGuess - answer) <= 1){
            advice = ". You Are Hot."
        } 
        else {
            advice = ". You are Warm"
        }
    } else if (levelArr[1].checked){
        if (Math.abs(userGuess - answer) <= 1){
            advice = ". You Are Hot."
        } else if (Math.abs(userGuess - answer) <= 3){
            advice = ". You Are Warm."
        } else{
            advice = ". You Are Cold."
        }
    } else {
        if (Math.abs(userGuess - answer) <= 5){
            advice = ". You Are Hot."
        } else if (Math.abs(userGuess - answer) <= 12){
            advice = ". You Are Warm."
        } else{
            advice = ". You Are Cold."
        }
    }

    if(userGuess > answer){
        msg.textContent = "Too High, Guess Again, " + finalName + advice
    }

    else if(userGuess < answer){
        msg.textContent = "Too Low, Guess Again, " + finalName + advice
    }
    else{
        if(levelArr[0].checked){
            if (score == 1){
                scoreDetermination = " You Did Good."
            } else if (score <= 3){
                scoreDetermination = " You Did Okay."
            } else{
                scoreDetermination = " You Did Bad."
            }
        } else if (levelArr[1].checked){
            if (score <= 4){
                scoreDetermination = " You Did Good."
            } else if (score <= 6){
                scoreDetermination = " You Did Okay."
            } else{
                scoreDetermination = " You Did Bad."
            }
        } else {
            if (score <= 7){
                scoreDetermination = " You Did Good."
            } else if (score <= 11){
                scoreDetermination = " You Did Okay."
            } else{
                scoreDetermination = " You Did Bad."
            }
        }

        msg.textContent = "Correct, " + finalName + "! It took " + score + " tries." + scoreDetermination;
        reset();
        updateScore();
    }
}

function giveUp(){
    msg.textContent = "You Gave Up, " + finalName + ". Your Score Was Bad";
    reset();
    if(levelArr[0].checked){
        score = 3;
    } else if (levelArr[1].checked){
        score = 10;
    } else {
        score = 100;
    }
    
    updateScore();
}

function reset(){
    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    guess.disabled = true;
    playBtn.disabled = false;

    clearInterval(timer);
    if (attempts == 0 || totalTime < recordTime){
        recordTime = totalTime;
    }

    hours = String(Math.floor(recordTime/(1000*60*60))).padStart(2, "0")
    minutes = String(Math.floor(recordTime/(1000*60))%60).padStart(2, "0")
    seconds = String(Math.floor(recordTime/(1000))%60).padStart(2, "0")

    fastestTime.textContent = "Fastest Time: " + hours + ":" + minutes + ":" + seconds;

    attempts++;
    totalTimeAllRounds += totalTime;

    for(let i=0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
    
}

function updateScore(){
    scoreArr.push(score); // adds current score to array of scores
    wins.textContent = "Total wins: " + scoreArr.length;
    let sum = 0;
    scoreArr.sort((a,b) => a-b); //sorts ascending
    // leaderboard?
    const lb = document.getElementsByName("leaderboard");

    for(let i=0; i<scoreArr.length; i++){
        sum += scoreArr[i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[i]
        }
    }
    let avg = sum/scoreArr.length
    let avgTimeSpent = totalTimeAllRounds/attempts

    hours = String(Math.floor(avgTimeSpent/(1000*60*60))).padStart(2, "0")
    minutes = String(Math.floor(avgTimeSpent/(1000*60))%60).padStart(2, "0")
    seconds = String(Math.floor(avgTimeSpent/(1000))%60).padStart(2, "0")

    avgScore.textContent = "Average Score: " + avg.toFixed(2);
    avgTime.textContent = "Average Time: " + hours + ":" + minutes + ":" + seconds;

}