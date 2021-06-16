const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = mongoose.model('User');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  User.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }

      return done(null, user);
    }).catch(done);
}));

// passport.use(new LocalStrategy(function(username, password, done) {
//   User.findOne({ "email": username }, function (err, user) {
//     if (err) { return done(err); }
//     if (!user) { return done(null, false); }
//     if (!user.validatePassword(password)) { return done(null, false); }
//     return done(null, user);
//   });
// }));