module.exports = {
    registerRoute: function (app,obj) {

        var configuration = obj.configuration;

        app.get('/about2', function(req, res) {
            res.render('pages/about');
        });

        // index page
        app.get('/', function(req, res) {
            var model = {configuration : configuration};
            res.render('pages/index',model );
        });

        //read more about path params
        app.get('/hello/:name', function(req, res) {
            var model = {name : req.params.name};
            res.render('pages/hello',model );
        });

        app.get('/about', function(req, res) {
            res.render('pages/about');
        });

    }
};