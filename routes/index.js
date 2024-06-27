var express = require('express');
var router = express.Router();
var axios = require('axios');
var helperFunctions = require('../public/javascripts/helper');

let quiz = [];
let currentQuestionIndex = 0;
let score = 0;
let correctOrNot = undefined;
let previousAnswer = '';

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
    res.redirect('/quiz');
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    res.status(500).send('Error fetching quiz data');
  }
});

//GET quiz question
router.get('/quiz', (req,res,next)=>{
  res.render('quiz', { quiz, currentQuestionIndex, score, correctOrNot});
});

//GET new quiz
router.get('/quiz-continued', (req,res,next)=>{
  res.render('quiz', {previousAnswer, correctOrNot, currentQuestionIndex, quiz, score});
});

//POST answer question
router.post('/answer-submit', function(req, res, next){
  const correctAnswer = quiz[currentQuestionIndex].correct_answer;
  previousAnswer = req.body.answer;
  if(previousAnswer === correctAnswer){
    score++;
    correctOrNot=true;
  }else{correctOrNot=false;}
  res.redirect("/quiz-continued");
});

//GET next question
router.get('/next-question',function(req, res, next){
  correctOrNot = undefined;
  currentQuestionIndex++;
  if(currentQuestionIndex >= quiz.length){
    helperFunctions.updateTotalScore(score);
    res.redirect('/final-scores');
    score = 0;
  }else{
    res.render('quiz',{quiz, currentQuestionIndex, score, correctOrNot});
  }
});

//GET final scores
router.get('/final-scores',(req,res,next)=>{
  const totalScore = helperFunctions.getTotalScore();
  const allGameScores = helperFunctions.getAllGameScores();
  res.render('score', {score, quiz, totalScore, allGameScores});
});

module.exports = router;
