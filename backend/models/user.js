const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs');
const e = require('express');

const user = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['ADMIN', 'CUSTOMER'], required: true }
},
{ timestamps: false, collection: 'Users' });


//hashowanie haseł przed zapisem do bazy
user.pre('save', async function(next) {
  if (!this.isModified('password'))  return next();
    try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
    } catch (error) {
        next(error);
    }
});

//porównywanie haseł przy logowaniu
user.methods.comparePassword = async function(candidatePassword) {
    return await bcryptjs.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', user);