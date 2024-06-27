var express = require('express');
var router = express.Router();
var axios = require('axios');
var helperFunctions = require('../public/javascripts/helper');

let quiz = [];
let currentQuestionIndex = 0;
let score = 0;
let correctOrNot = undefined;

/* GET home page. */
router.get('/', function(req, res, next) {
  quiz = [];
  currentQuestionIndex = 0;
  score = 0;
  correctOrNot = undefined;
  res.render('index');
});

//POST question form
router.post('/form-submit', async function(req, res, next){
  try {
    const formData = req.body;
    const queryString = helperFunctions.getQueryString(formData);
    const url = `https://opentdb.com/api.php?${queryString}`;
    const apiResponse = await axios.get(url);
    if (apiResponse.status !== 200) {
      throw new Error('Failed to fetch quiz data');
    }
    quiz = apiResponse.data.results;
    currentQuestionIndex = 0;
    score = 0;
    res.render('quiz', { quiz, currentQuestionIndex, score, correctOrNot});
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    res.status(500).send('Error fetching quiz data');
  }
});

//POST answer question
router.post('/answer-submit', function(req, res, next){
  const correctAnswer = quiz[currentQuestionIndex].correct_answer;
  const submittedAnswer = req.body.answer;
  console.log(correctAnswer + "---" + submittedAnswer);
  if(submittedAnswer === correctAnswer){
    score++;
    correctOrNot=true;
  }else{correctOrNot=false;}
  res.render('quiz', {submittedAnswer, correctOrNot, currentQuestionIndex, quiz, score})
});

//GET next question
router.get('/next-question',function(req, res, next){
  currentQuestionIndex++;
  correctOrNot = undefined;
  if(currentQuestionIndex >= quiz.length){
    helperFunctions.updateTotalScore(score);
    const totalScore = helperFunctions.getTotalScore();
    const allGameScores = helperFunctions.getAllGameScores();
    res.render('score', {score, quiz, totalScore, allGameScores});
    score = 0;
  }else{
    res.render('quiz',{quiz, currentQuestionIndex, score, correctOrNot});
  }
});

module.exports = router;
