const express = require('express');
const {Sequelize} = require('sequelize');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;

const app = express();

//Config load
require('dotenv').config();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

//Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Import routes
const usersRoute = require('./api/users');
const apiRoute = require('./api/index');
const ordersRoute = require('./api/orders');
const expenseRoute = require('./api/expense_report');
const qrRoute = require('./api/qr');
const workingRoute = require('./api/working_report');

app.use('/api', apiRoute);
app.use('/api/users', usersRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/expense_report',expenseRoute);
app.use('/api/qr', qrRoute);
app.use('/api/working_report', workingRoute);

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

module.exports = app