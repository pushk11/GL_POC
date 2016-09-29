var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


/*app.get('/', function (req, res) {
   res.send('Hello World');
})*/
var ideas = require("./routes/ideas");
app.get('/ideas', function(req, res){
	console.log(req.params);

	ideas.getList(req, res);
});

app.post('/ideas/new', function(req, res) {
	ideas.addIt(req, res);
});

app.post('/ideas/update', function(req, res) {
	ideas.updateIt(req, res);
});

app.delete('/ideas/delete/:id', function(req, res){
	ideas.deleteIt(req, res);
});

var server = app.listen(8081, function () {

var host = server.address().address
var port = server.address().port

console.log("Example app listening at http://%s:%s", host, port)

})
