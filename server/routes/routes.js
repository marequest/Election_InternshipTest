const userRoutes = require('./candidates');

const appRouter = (app, fs) => {
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });

    userRoutes(app, fs);
};

module.exports = appRouter;