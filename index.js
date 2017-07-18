var exp = require('express');
var mong= require('mongoose');
var handlebars= require('express-handlebars');
var bodyParser = require('body-parser');
var request = require('request')
mong.connect('mongodb://unc:landmine@ds117348.mlab.com:17348/itheater');
var moviedata = require('./api/movies.js');
var searchYoutube = require('./views/movie/search.handlebars')
var imdb = require('imdb-api');
var youtubeSearch = require('youtube-search');

app= exp();
app.use(bodyParser.urlencoded({'extended':false}));
app.use(bodyParser.json());


var moviemodel = mong.model("movies",{name:String,
city: String,
ratings: String});

var registrationModel = mong.model('registration',{FirstName:String,
LastName: String,
Email: String,
Password: String});

var searchModel = {
  moviename: String
};

app.engine('handlebars', handlebars.create({
  defaulLayout: 'main',
  layoutsDir: './views/layouts',
  partialDir: './views/partials',
}).engine);

app.set('view engine', 'handlebars');
// mongodb://<dbuser>:<dbpassword>@ds117348.mlab.com:17348/itheater
// console.log(moviedata);
var Router = exp.Router();
var cityModel = mong.model('cities', {name: String});
Router.get('/city/:moscow', function(req,res){
  var seasionname=req.params.moscow;
  var city = new cityModel({name: seasionname});
  city.save(function(error){
    res.render('index',{moscow: 'this ' +seasionname+', is good', moviedataInsideTemplate: moviedata, issave: error ? "record is not save":"Welcome To iTheater"})
  });
});
Router.get('/movie/register', function(req,res){
  res.render("registeraddpage", {namePage: "Register To iTheater"});
});
Router.get('/movie/add', function(req,res){
    var registrationFromRoute=req.query;
    var registration= new registrationModel ({FirstName:registrationFromRoute.FirstName, LastName: registrationFromRoute.LastName, Email: registrationFromRoute.Email, Password: registrationFromRoute.Password });
    registration.save(function(err){
      if(err){
        console.log(err);
      }
      res.redirect('/movie/search');
    });
});
Router.get('/movie/moviepage', function(req,res){
  res.render('movie/moviepage')

});
Router.get('/movie/login', function(req,res){
  res.render('movie/login');
});


Router.get('/movie/moviepage', function(req,res){

});
Router.get('/movie/search', function(req,res){
  var search=req.query;
  var opts = {
  maxResults: 10,
  key: 'AIzaSyATNFgR-l64ahNmgkfdy56-1BU5RRIY9L8'
};
search(search , opts, function(err, results) {
  if(err) return console.log(err);

  console.log(result['Search']);
});
      res.render('movie/search', {movieList: body['Search']})
    })

});
Router.get('/movie/dashboard', function(req,res){
  res.render('movie/dashboard')
});


Router.get('/movie/landpage/', function(req,res){
  res.render('movie/landpage')

});

Router.get('/movie/google2254da6d286b6de0', function(req,res){
  res.render('movie/google2254da6d286b6de0');
});
Router.get('/movie/add', function(req,res){
  var movieFromRoute=req.query;
  var movie = new moviemodel({name:movieFromRoute.moviename, city: movieFromRoute.city, ratings: movieFromRoute.ratings });
  movie.save(function(err){
    if(err){
      console.log(err);
    }
    res.redirect('/movie/addpage');
  });
});
Router.get('movie/home', function(req,res){
  res.render('movie/home');
});

// http://hostname/movie/ttxxxxxxx
app.get('/movie/get', function(req,res){
  var id = req.query.id;

  imdb.getById(id).then(function (movie) {
    var title = movie.title;
    var year = movie._year_data;

    var opts = {
      maxResults: 1,
      key: 'AIzaSyATNFgR-l64ahNmgkfdy56-1BU5RRIY9L8'
    };

    var searchQuery = title + ' trailer ' + year;
    console.log("Query", searchQuery);

    youtubeSearch(searchQuery, opts, function(err, results) {
      if (err) {
        console.log('Failed to make search:', err);
        res.status(500).send('Couldn\'t find a trailer!');
        return;
      }

      var youtubeID = results[0].id;
      res.render('movie/get', { id: youtubeID });
    });
  });
});

app.use(Router);

app.get("*", function(req, res) {
  res.redirect('/movie/landpage');
});

app.use('/public', exp.static('public'));
app.listen(process.env.PORT || 5000,function(){
  console.log(process.env.PORT);
});
