var path = require('path');

// Postgres DATABAS_URL = postgres://user:passwd@host:port/database
// SQLite DATABAS_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = 	(url[6]||null);
var user 	 = 	(url[2]||null);
var pwd 	 = 	(url[3]||null);
var protocol = 	(url[1]||null);
var dialect  = 	(url[1]||null);
var port 	 = 	(url[5]||null);
var host 	 = 	(url[4]||null);
var storage  = 	process.env.DATABASE_STORAGE;

// Cargar modelo ORM
var Sequelize = require('sequelize');

// var sequelize = new Sequelize(null, null, null, {
// 				dialect: "sqlite", storage: "quiz.sqlite"
// 			});
// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, {
				dialect: protocol, 
				protocol: protocol,
				port: port,
				host: host,
				storage: storage, // solo SQLite (.env)
				omitNull: true    // solo Postgres
			});

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; // Exportar definicion de la tabla Quiz

// sequelize.sync() crear e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	// success(..) ejecuta el manejador una vez creada la tabla 
	Quiz.count().then(function(count){
		if(count == 0){ //La tabla se inicializa solo si esta vacia
			Quiz.create({
				pregunta: '¿Nombre del pais Italia en Inglés?',
				respuesta: 'Italy',
				tematica: 'otro'
			});
			Quiz.create({
				pregunta: '¿Capital de Italia?',
				respuesta: 'Roma',
				tematica: 'ocio'				
			});
			Quiz.create({
				pregunta: '¿Valor del numero pi?',
				respuesta: '3.1416',
				tematica: 'ciencia'
			});
			Quiz.create({
				pregunta: '¿Quien descubrio America?',
				respuesta: 'Cristobal Colon',
				tematica: 'humanidades'
			});
			Quiz.create({
				pregunta: '¿Como se llama el último juguete de Apple?',
				respuesta: 'iWatch',
				tematica: 'tecnologia'
			});
			Quiz.create({
				pregunta: '¿Capital de Portugal?',
				respuesta: 'Lisboa',
				tematica: 'ocio'				
			}).then(function(){console.log('Base de datos inicializada')});
		}
	});
});