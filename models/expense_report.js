const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, 
    process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});

const Expense_report = sequelize.define('expense_report', {
    //attributes
    id:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    user_id:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
    },
    type:{
        type: Sequelize.ENUM,
        values: ['Food', 'Travel'],
        allowNull: false,
    },
    expense:{
       type: Sequelize.INTEGER(11).UNSIGNED,
       allowNull: false, 
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull: false,
        validate:{
            isBefore: (new Date()).toDateString(),
        }
    },
    remarks:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    status:{
        type: Sequelize.ENUM,
        defaultValue: 'unverified',
        values: ['unverified', 'verified'],
        allowNull: false,
    }
},{
    tableName: 'Expense_report'
});

( async () => {
    await Expense_report.sync()
        .then(() => {
            console.log('Expense report table created successfully.')
        })
})();

module.exports = Expense_report;