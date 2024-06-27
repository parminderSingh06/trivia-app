const fs = require('fs');
const path = require('path');
const scoresFilePath = path.join(__dirname, "../../scores.json");

function readScore(){
  const data = fs.readFileSync(scoresFilePath);
  return JSON.parse(data);
}

function writeScore(scoreData){
  fs.writeFileSync(scoresFilePath, JSON.stringify(scoreData, null, 2));
}

function getTotalScore(){
  const scores = readScore();
  return scores.totalScore;
}

function getAllGameScores(){
  const scores = readScore();
  return scores.allGames;
}

function updateTotalScore(newScore){
  const scores = readScore();
  scores.totalScore += newScore;
  scores.allGames.push(newScore);
  writeScore(scores);
}

function getQueryString(formData) {
    const amount = `amount=${formData.numQuestions}`;
    const category = formData.category !== 'any' ? `&category=${formData.category}` : '';
    const difficulty = formData.difficulty !== 'any' ? `&difficulty=${formData.difficulty}` : '';
    const type = formData.type !== 'any' ? `&type=${formData.type}` : '';
    return amount + category + difficulty + type; 
}

module.exports = {
  getQueryString,
  updateTotalScore,
  getAllGameScores,
  getTotalScore
};