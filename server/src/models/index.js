const dbConfig = require('../config/config')

const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.db.DB,
    dbConfig.db.USER,
    dbConfig.db.PASSWORD,
    {
        host: dbConfig.db.HOST,
        dialect: dbConfig.db.dialect,
        port: dbConfig.db.PORT,
        operatorAliases: false,
        pool: {
            max: dbConfig.db.pool.max,
            min: dbConfig.db.pool.min,
            acquire: dbConfig.db.pool.acquire,
            idle: dbConfig.db.pool.idle
        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected')
})
.catch(err => {
    console.log('Error' + err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.products = require('./productModel.js')(sequelize, DataTypes)
db.users = require('./userModel.js')(sequelize, DataTypes)
db.customers = require('./customerModel.js')(sequelize, DataTypes)
db.trades = require('./tradeModel.js')(sequelize, DataTypes)

db.sequelize.sync({force: false})
.then(() => {
    console.log('yes re-sync done!')
})

module.exports = db