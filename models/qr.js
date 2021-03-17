const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, 
    process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});

const Url = sequelize.define('qr_url',{
    id:{
        type:Sequelize.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey:true
    },
    url:{
        type:Sequelize.STRING,
    }
});

( async () => {
    await Url.sync()
        .then(() => {
            console.log('Url table created successfully.')
        })
})();

module.exports = Url;