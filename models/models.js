var path = require('path');

//Postgre DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//Cargar Model ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o postgres
var sequelize = new Sequelize(DB_name, user, pwd,
                              { dialect: dialect,
                                protocol: protocol,
                                port: port,
                                host: host,
                                storage: storage,
                                omitNull: true
                              }
                            );

//Importar la definición de la tabla Quiz en quiz.json
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; //Exportar definición de tabla Quiz

//sequelize.sync() crea e inicializa tabla de preguntas en debug
sequelize.sync().then(function(){
  //success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count){
    if(count === 0) { //la tabla se inicializa sólo si está vacía
      Quiz.create({
        pregunta: 'Capital de Italia',
        respuesta: 'Roma'
      });
      Quiz.create({
        pregunta: 'Capital de Portugal',
        respuesta: 'Lisboa'
      }).then(function(){console.log('Base de datos inicializada')});

    }
  });
});
