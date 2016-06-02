// Dependencies
var mongoose = require('mongoose');
var User = require('./model.js');

// Opens App routes
module.exports = function (app) {

    // GET routes
    // Retrieve records for all users in the db
    app.get('/users', function (req, res) {

        // Uses Mongoose schema to run the search ( empty conditions)
        var query = User.find({});
        query.exec(function (err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });

    });

    // POST Routes
    // Provides method for saving new users in the db
    app.post('/users', function (req, res) {

        // Creates a new user based on the Mongoose schema and the post body
        var newUser = new User(req.body);

        newUser.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.json(req.body);
            }
        });
    });
};
