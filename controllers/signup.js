var router = require('express').Router();
var User = require('../models/user');

// POST create new user
router.post('/new_user', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var city = req.body.city;
  var country = req.body.country;

  User.findOne({ email: email }, function(err, user) {
    if (err) return next(err);
    if (user) {
      return res.status(409).send({ message: user.email + ' is already registered' });
    } else {
      try {
        var user = new User({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          city: city,
          country: country
        });
        user.save(function(err) {
          if (err) return next(err);
          res.send({ message: 'Registration successful' });
        });
      } catch (error) {
        res.status(404).send({ message: 'An error occured, please try refreshing the page and registering again' })
      };
    };
  });
});

module.exports = router;