

module.exports = {
    registerRoute: function (expressApp) {

        expressApp.get('/about2', function(req, res) {
            res.render('pages/about');
        });

    }
};