module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        account: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return User
}