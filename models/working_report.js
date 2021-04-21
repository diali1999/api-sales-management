const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, 
    process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});

const Working_report = sequelize.define('work_report', {
    //attributes
    id:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    userId:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    longitude: {
        type: DataTypes.FLOAT(11,7),
        allowNull: false, 
    },
    latitude:{
        type: DataTypes.FLOAT(11,7),
        allowNull: false
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull: false,
    },
    status:{
        type: Sequelize.ENUM,
        defaultValue: 'unverified',
        values: ['verified', 'unverified'],
        allowNull: false,
    }
},{
    tableName: 'Work_report'
});

( async () => {
    await Working_report.sync()
        .then(() => {
            console.log('Work report table created successfully.')
        })
})();

module.exports = Working_report;