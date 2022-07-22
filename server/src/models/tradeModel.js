module.exports = (sequelize, DataTypes) => {
    const Trade = sequelize.define("trade", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
        },
        package: {
            type: DataTypes.INTEGER,
        },
        totalNumber: {
            type: DataTypes.INTEGER,
        },
        sellUint: {
            type: DataTypes.STRING,
        },
        uintPrice: {
            type: DataTypes.INTEGER,
        },
        aTradePrice: {
            type: DataTypes.INTEGER,
        },
        customer_name: {
            type: DataTypes.STRING
        },
        user_name: {
            type: DataTypes.STRING
        },
        cash: {
            type: DataTypes.INTEGER,
        },
        cashDate: {
            type: DataTypes.DATE,
        }
    })

    return Trade
}