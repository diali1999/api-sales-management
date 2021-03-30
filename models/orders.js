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
    userId:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
    },
    product: {
        type: DataTypes.JSON,
        defaultValue: '[]',
        allowNull: false, 
        get: function() {
          return JSON.parse(this.getDataValue("product"));
        },
        set: function(value) {
          return this.setDataValue("product", JSON.stringify(value));
        }
    },
    status:{
        type: Sequelize.ENUM,
        defaultValue : 'in queue',
        values: ['in queue', 'processed', 'cancelled'],
        allowNull: false,
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