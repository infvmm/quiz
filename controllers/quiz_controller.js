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
    if(param) {
        var search = param.trim();
        search = '%' + search + '%';
        search = search.replace(/\s+/g, '%');
        search = search.toLowerCase();
        models.Quiz.findAll(
                {
                   where: ["LOWER(pregunta) like ?", search], 
                   order: 'tematica ASC'
                 }
              ).then(function(quizes){
        res.render('quizes/index', {quizes:quizes, errors: []});
        }).catch(function(error){
          next(error);
        });
    } else {
        models.Quiz.findAll({order: 'tematica ASC'}).then(function(quizes){
          res.render('quizes/index', {quizes:quizes, errors: []});
        }).catch(function(error){
          next(error);
        });
    }
};

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find({
      where: { id: Number(quizId)},
      include: [{model: models.Comment}]
  }).then(
      function(quiz){
        if(quiz){
          req.quiz = quiz;
          next();
        } else {
           next(new Error('No existe quizId: ' + quizId));
        }
      }
    ).catch(function(error){next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// validarRespuesta = function(resp, value, next){  
//     if(!value){
//       next(new Error('Respuesta vacia'));
//     }

//       var respuestaFinal = parseRespuesta(value);    
//       var correcta = = parseRespuesta(resp);    
//         var match = respuestaFinal.match(/(cristobalcolon)?(colon)?/);
//         if(match && match[0]){
//           return 1;
//         } 
//           return 0;
//   };

// parseRespuesta = function(respuesta){
//       var respuestaFinal = String(parsed).toLowerCase().trim();    
//       respuestaFinal = respuestaFinal.replace(/\s*/g,'');
//       respuestaFinal = respuestaFinal.replace(/ó/,'o');
//       respuestaFinal = respuestaFinal.replace(/á/,'a');
//       respuestaFinal = respuestaFinal.replace(/é/,'e');
//       respuestaFinal = respuestaFinal.replace(/í/,'i');
//       respuestaFinal = respuestaFinal.replace(/ú/,'u');
//       return respuestaFinal;
// };  

// GET /quizes/:id/answer
exports.answer = function(req, res) {
    if(req.query.respuesta === req.quiz.respuesta){
      res.render('quizes/answer', {quiz:req.quiz,respuesta: 'Correcto', errors: []}) 
    } else {
      res.render('quizes/answer', {quiz:req.quiz,respuesta: 'Incorrecto', errors: []}) 
    }    
};



exports.new = function(req, res){
  var quiz = models.Quiz.build( // crea un objeto quiz
      {pregunta: "Pregunta", respuesta: "Respuesta", tematica: "Tematica"}
    );

  res.render('quizes/new', {quiz: quiz, errors: []});
}

// POST /quizes/create
exports.create = function(req, res){
 var quiz = models.Quiz.build(req.body.quiz);

  quiz.validate().then(function(err){
    if(err){
      res.render('quizes/new', {quiz:quiz ,errors: err.errors});
    } else{
      // guarda en DB los campos pregunta y respuesta de quiz
      quiz.save({fields:["pregunta","respuesta","tematica"]}).then(function(){
          // Redireccion HTTP (URL relativo) lista de preguntas
          res.redirect('/quizes');         
      });
    }
  });
}

// GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz;

  res.render('quizes/edit', {quiz: quiz, errors: []}); 
}

// PUT /quizes/:id
exports.update = function(req, res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tematica = req.body.quiz.tematica;

  req.quiz.validate().then(function(err){
    if(err){
      res.render('quizes/edit', {quiz:req.quiz ,errors: err.errors});
    } else{
      // guarda en DB los campos pregunta y respuesta de quiz
      req.quiz.save({fields:["pregunta","respuesta","tematica"]}).then(function(){
          // Redireccion HTTP (URL relativo) lista de preguntas
          res.redirect('/quizes');         
      });
    }
  });
}

// GET /quizes/:id/destroy
exports.destroy = function(req, res){
  req.quiz.destroy().then(function(){
     // Redireccion HTTP (URL relativo) lista de preguntas
          res.redirect('/quizes');         
  }).catch(function(error){
    next(error);
  });
}