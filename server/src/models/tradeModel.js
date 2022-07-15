module.exports = (sequelize, DataTypes) => {
    const Trade = sequelize.define("trade", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER
        },
        package: {
            type: DataTypes.INTEGER
        },
        customer_name: {
            type: DataTypes.STRING
        },
        user_name: {
            type: DataTypes.STRING
        },
        cash: {
            type: DataTypes.INTEGER
        },
        cashDate: {
            type: 'TIMESTAMP',
        }
    })

    return Trade
}