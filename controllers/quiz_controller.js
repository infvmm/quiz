var models = require('../models/models.js');

// // GET /quizes/question
// exports.question = function(req, res) {
//   //res.render('quizes/question', {pregunta: 'Capital de Italia'});
//   models.Quiz.findAll().success(function(quiz){
//   	res.render('quizes/question', {pregunta: quiz[0].pregunta});
//   });
// }

// // GET /quizes/answer
// exports.answer = function(req, res) {
//   	// if(req.query.respuesta === 'Roma'){
// 	  //   res.render('quizes/answer', {respuesta: 'Correcto'}) 
//   	// } else {
//   	// 	res.render('quizes/answer', {respuesta: 'Incorrecto'}) 
//   	// }
//   	models.Quiz.findAll().success(function(quiz){
// 	 	if(req.query.respuesta === quiz[0].respuesta){
// 		    res.render('quizes/answer', {respuesta: 'Correcto'}) 
//   	 	} else {
// 	  	 	res.render('quizes/answer', {respuesta: 'Incorrecto'}) 
//   		 }  	
//   	});
// }

// GET /quizes
exports.index = function(req, res){
  var param = req.query.search;
  console.log('index param: ' + param);
    if(param) {
        var search = param.trim();
        search = '%' + search + '%';
        search = search.replace(/\s+/g, '%');
        console.log('index search: ' + search);
        // models.Quiz.findAll(
        // {
        //         where: ["pregunta like ?", search], 
        //         order: '`pregunta` ASC'
        //       }
              models.Quiz.findAll().then(function(quizes){
                console.log('index quizes: ' + quizes);
        res.render('quizes/index', {quizes:quizes});
        }).catch(function(error){
          console.log('index error: ' + error);
          next(error);
        });
    } else {
        res.render('quizes/index', {quizes:undefined});
    }
};

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  console.log('quizId' + quizId);
  models.Quiz.find(quizId).then(
      function(quiz){
        console.log('quiz' + quiz);
        if(quiz){
          console.log('quiz' + quiz.id);
          req.quiz = quiz;
          console.log('quiz next' );
          next();
        } else {
           next(new Error('No existe quizId: ' + quizId));
        }
      }
    ).catch(function(error){next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
  console.log('show' + req.quiz.id);
  console.log('show' + req.quiz.id);
    res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
    if(req.query.respuesta === req.quiz.respuesta){
      res.render('quizes/answer', {quiz:req.quiz,respuesta: 'Correcto'}) 
    } else {
      res.render('quizes/answer', {quiz:req.quiz,respuesta: 'Incorrecto'}) 
    }    
};