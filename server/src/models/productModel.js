module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
        },
        uint: {
            type: DataTypes.STRING,
        },
        sellUint: {
            type: DataTypes.STRING,
        },
        number: {
            type: DataTypes.INTEGER,
        }
    })

    return Product
}