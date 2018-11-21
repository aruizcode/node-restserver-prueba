require('./config/config');
const express = require('express');

const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function (req, res) {

  if (req.body.nombre == undefined){
    res.status(400).json({
      error : "falta el usuario"
    });
  }else{
    let body = req.body;
    let persona = {
      persona : body
    }
    res.json(persona);
  }

});

app.post('/usuario', function (req, res) {
  res.json('post User');
});

app.put('/usuario/:id', function (req, res) {

  let id = req.params.id;
  let identificador = {
    id
  }
  res.json(identificador);

});

app.delete('/usuario', function (req, res) {
  res.json('delete User');
});


app.listen(process.env.PORT , () => {
  console.log("Escuchando el puerto" , process.env.PORT);
});
