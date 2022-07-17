module.exports = (sequelize, DataTypes) => {
    const cashMethod = sequelize.define("cashMethods", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return cashMethod
}