const express = require('express');
const bodyParser = require('body-parser');
const {Sequelize} = require('sequelize');

const app = express();

require('dotenv');

app.use(bodyParser.json());
// Import routes
const usersRoute = require('./api/users');

app.use('/api/users/', usersRoute);

const port = process.env.PORT || 5000;

// Connect to DB
const sequelize = new Sequelize(process.env.DB_NAME, 
    process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});

// Authenticating the connection
try {
    (async () => {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    })();
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.listen(port, () => {
    console.log(`App up and listening at port ${port}`)
})