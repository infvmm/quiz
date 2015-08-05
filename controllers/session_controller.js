// Get /login -- Formulario de login
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// Post /login -- Crear la sesion
exports.create = function(req, res){
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){
		if(error){ // si hay error retornamos mensajes de error de sesion
			req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
			res.redirect("/login");
			return;
		}

		// Crear req.session.user y guradar campos id y username
		// La sesion se define por la existencia de: req.session.user
		req.session.user = {id:user.id, username: user.username};

		if(req.session.redir){
			res.redirect(req.session.redir.toString()); // redireccion a path a anterior a login
		} else {
			res.redirect("/login");
			return;
		}
	});
};

// Delte /logout -- Destruir sesion
exports.destroy = function(req, res){
	delete req.session.user;
	if(req.session.redir){
		res.redirect(req.session.redir.toString()); // redireccion a path a anterior a login
	} else {
			res.redirect("/login");
			return;
		}
};

// MW de autorizacion de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
	if(req.session.user){
		next();
	} else {
		res.redirect('/login');
	}
};