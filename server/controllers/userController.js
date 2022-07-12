const db = require('../models')

const User = db.users

// main work

// 1. create user

const addUser = async (req, res) => {
    let info = {
        account: req.body.account,
        password: req.body.password
    }

    const user = await User.create(info)
    res.status(200).send(user)
    //console.log(user)
}

// 2. get all user

const getAllUsers = async (req, res) => {
    let users = await User.findAll({})
    res.status(200).send(users)
}

// 3. get single user by id

const getOneUser = async (req, res) => {
    let id = req.params.id
    let user = await User.findAll({where: { id: id }})
    res.status(200).send(user)
}

// 4. update user by id

const updateUser = async (req, res) => {
    let id = req.params.id
    let user = await User.update(req.body, {where: { id: id }})
    res.status(200).send(user)
}

// 5. delete user by id

const deleteUser = async (req, res) => {
    let id = req.params.id
    await User.destroy({where: { id: id }})
    res.status(200).send('User is deleted!')
}

module.exports = {
    addUser,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser
}