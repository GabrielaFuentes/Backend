// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// // Definir el esquema del usuario
// const userSchema = new mongoose.Schema({
//   first_name: { type: String, required: true },
//   last_name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   age: { type: Number, required: true },
//   password: { type: String, required: true },
//   cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
//   role: { type: String, default: 'user' }
// });

// // Encriptar la contraseña antes de guardar
// userSchema.pre('save', function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = bcrypt.hashSync(this.password, 10);
//   next();
// });

// // Método para comparar contraseñas
// userSchema.methods.comparePassword = function (candidatePassword) {
//   return bcrypt.compareSync(candidatePassword, this.password);
// };

// // Crear el modelo
// const User = mongoose.model('User', userSchema);

// module.exports = User;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
    role: { type: String, default: 'user' }
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;