const userRoutes = (app, fs) => {
    // variables
    const dataPath = './data/candidates.json';

    // READ
    app.get('/candidates', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });
};

module.exports = userRoutes;