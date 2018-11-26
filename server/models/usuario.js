const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
  values : ['USER_ROLE','ADMIN_ROLE'],
  message : '{VALUE} no es un rol valido'
};

let UsuarioSchema = new Schema({
    nombre : {
      type : String,
      required : [true, 'El nombre es necesario']
    },
    email : {
      type: String,
      unique: true,
      required : [true, 'El email es necesario']
    },
    password : {
      type : String,
      required : [true, 'La contraseña es obligatoria']
    },
    img : {
      type : String,
      required: false
    },
    role : {
      type : String,
      default : 'USER_ROLE',
      enum : rolesValidos
    },
    estado : {
      type : Boolean,
      default : true
    },
    google : {
      type : Boolean,
      default : false
    }
});

UsuarioSchema.methods.toJSON = function(){
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

UsuarioSchema.plugin(uniqueValidator , {message : '{PATH} debe de ser unico'});

module.exports = mongoose.model('Usuario', UsuarioSchema);
