const {Sequelize, DataTypes} = require('sequelize');
require('dotenv').config({path: __dirname+'/../.env'});

const sequelize = new Sequelize(process.env.DB_NAME, 
    process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});

const User = sequelize.define('user', {
    //attributes
    id:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    hashedPassword:{
        type: DataTypes.STRING(60),
        validate:{
            is: /^[.a-zA-Z0-9$/]{60}$/
        }
    },
    phone:{
        type: DataTypes.STRING(10),
        validate: {
            is: /^[6-9][0-9]{9}$/
        }
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true,
        }
    },
    DOB:{
        type: DataTypes.DATEONLY,
        isDate: true,
        allowNull: false,
        // validate:{
        //     // greaterThanOr18(value){
        //     //     var today = new Date();
        //     //     var birthDate = Date.parse(value);
        //     //     var age = today.getFullYear() - birthDate.getFullYear();
        //     //     var m = today.getMonth() - birthDate.getMonth();
        //     //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        //     //         age--;
        //     //     }
        //     //     if(age<18){
        //     //         throw new Error("Age can't be less than 18");
        //     //     }
        //     // }
        // }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false
    },
    department:{
        type:DataTypes.STRING,
        allowNull: false
    },
    DOJ:{
        type:DataTypes.DATEONLY,
        allowNull: false,
        validate:{
            isBefore: (new Date()).toDateString(),
        }
    }
},{
    tableName: 'User'
});

( async () => {
    await User.sync()
        .then(() => {
            console.log('User table created successfully.')
        })
})();

module.exports = User;