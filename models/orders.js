const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, 
    process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});

const Order = sequelize.define('order', {
    //attributes
    id:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    empid:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        references:{
            model:'user',
            key:'id'
        }
    },
    status: { 
        type: Sequelize.ENUM,
        values: ['in queue', 'processed', 'cancelled'],
        allowNull: false,
        defaultValue: 'in queue'
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull: false,
        validate:{
            isBefore: (new Date()).toDateString(),
        }
    }
},{
    tableName: 'Order'
});

( async () => {
    await Order.sync()
        .then(() => {
            console.log('Order table created successfully.')
        })
})();

module.exports = Order; 