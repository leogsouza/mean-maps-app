// Dependencies
var mongoose = require('mongoose');
var User = require('./model.js');

// Opens App routes
module.exports = function (app) {

    // GET routes
    // Retrieve records for all users in the db
    app.get('/users', function (req, res) {

        // Uses Mongoose schema to run the search ( empty conditions)
        console.log('teste reload');;
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

    // Retrieves JSON records for all users who meet a certain set of query conditions
    app.post('/query/', function(req, res) {

        // Grab all of the parameters from the body
        var lat         = req.body.latitude;
        var long        = req.body.longitude;
        var distance    = req.body.distance;
        var male        = req.body.male;
        var female      = req.body.female;
        var other       = req.body.other;
        var minAge      = req.body.minAge;
        var maxAge      = req.body.maxAge;
        var favlang     = req.body.favlang;
        var htmlverified    = req.body.htmlverified;

        // Opens a generic Mongoose query. Depending on the post body we will...
        var query = User.find({});

        // ...include filter by max distance (converting miles to meters)
        if(distance) {

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat])
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34, spherical: true});
        }

        // ...include filter by gender (all options)
        if(male || female || other) {
            query.or([{ 'gender': male }, { 'gender': female }, { 'gender': other }]);
        }

        // ...include filter by Min Age
        if(minAge) {
            query = query.where('age').gte(minAge);
        }

        // ..include filter by Max Age
        if(maxAge) {
            query = query.where('age').lte(maxAge);
        }

        // ...include filter by Favorite Language
        if(favlang) {
            query = query.where('favlang').equals(favlang);
        }

        // ...include filter by HTML5 Verified Locations
        if(htmlverified) {
            query = query.where('htmlverified').equals('Yep (Thanks for giving us real data!)');
        }



        // Execute Query and return Query results
        query.exec(function(err, users) {
            if(err){
                console.log('Error ao executar a busca', err);
                res.send(err);
            }
            // If no errors respond with a JSON of all users that meet the criteria
            console.log('users filtered',users);
            res.json(users);
        });
    });
};
