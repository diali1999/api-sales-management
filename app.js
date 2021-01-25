const express = require('express');
const {Sequelize} = require('sequelize');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

//Config load
require('dotenv').config();

//Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Import routes
const usersRoute = require('./api/users');
const apiRoute = require('./api/index');

app.use('/api', apiRoute);
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