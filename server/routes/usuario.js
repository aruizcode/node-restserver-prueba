const express = require('express');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', verificaToken ,(req, res) => {

    let desde = req.query.desde || 2;
    desde=Number(desde);
    let hasta = req.query.hasta || 4;
    hasta=Number(hasta);

        Usuario.find({estado : true} , 'nombre email role estado google img')
          .skip(desde)
          .limit(hasta)
          .exec( (err,usuarios) => {
            if (err) {
              return res.status(400).json({
                mensaje : 'ha habido un error al mostrar el usuario',
                ok : false,
                err
              });
            }
            Usuario.count({estado : true} , (err,conteo) => {
              res.json({
                ok: true,
                usuarios,
                cuantos : conteo
              });
            });

          });
});
app.post('/usuario',[verificaToken , verificaAdmin_Role] , function (req, res) {

  let body = req.body;

  let usuario = new Usuario({
    nombre : body.nombre,
    email : body.email,
    password : bcrypt.hashSync(body.password , 10),
    role : body.role
  });

  usuario.save ((err,usuarioDB) => {
    if (err) {
      return res.status(400).json({
        mensaje : 'ha habido un error al agregar el usuario',
        ok : false,
        err
      });
    }

    res.json({
      ok : true,
      usuario : usuarioDB

    });
  });

});
app.put('/usuario/:id',[verificaToken , verificaAdmin_Role] , function (req, res) {

  let id = req.params.id;
  let body = _.pick(req.body , ['nombre','email','img','role','estado']);

  Usuario.findByIdAndUpdate(id ,body , {new : true ,runValidators: true},(err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        mensaje : 'ha habido un error al agregar el usuario',
        ok : false,
        err
      });
    }

    res.json({
      ok:true,
      usuario : usuarioDB
    });
  });
});
app.delete('/usuario/:id',[verificaToken , verificaAdmin_Role]  , function (req, res) {

    let id = req.params.id;
    let CambiarEstado = {
      estado : false
    }
    //Usuario.findByIdAndRemove(id , (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id , CambiarEstado, {new : true}, (err, usuarioBorrado) => {

      if (err) {
        return res.status(400).json({
          mensaje : 'ha habido un error al borrar el usuario',
          ok : false,
          err
        });
      }
      if(usuarioBorrado === null) {
        res.json({
          ok : true,
          err : {
            message : 'usuario no encontrado'
          }
        })
      }
      res.json({
        ok : true,
        usuarioBorrado,
        info : {
          message : 'usuario borrado correctamente'
        }
      });
    });
});

module.exports = app;
