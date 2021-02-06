const {Sequelize, DataTypes} = require('sequelize');

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
    firstName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    gender:{
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
            is: /^[MFCT]{1}$/
        }
    },
    salary:{
        type: DataTypes.INTEGER,
        allowNull:true,
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

// User.hasMany(Order);

module.exports = User;