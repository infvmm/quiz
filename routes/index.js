var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* GET home page. */
router.get('/autor', function(req, res) {
  res.render('autor',{});
});

/* GET Quizes Question. */
router.get('/quizes/question', quizController.question);

/* GET Quizes Answer. */
router.get('/quizes/answer', quizController.answer);

module.exports = router;
