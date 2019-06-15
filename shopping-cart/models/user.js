var mongoose = require('mongoose');

// Add bcrypt package
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

// Now we are going to add helper methods to encrupt the password

// Takes in a password an uses mongoose and the bcrypt function to encrypt it a password
userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

/* We check the current password and compare it to the user password*/ 
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
    // this refers to the current user
}

module.exports = mongoose.model('User', userSchema);
