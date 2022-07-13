const db = require('../models')

const Customer = db.customers

// main work

// 1. create customer

const addCustomer = async (req, res) => {
    let info = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    }

    const customer = await Customer.create(info)
    res.status(200).send(customer)
    //console.log(customer)
}

// 2. get all customer

const getAllCustomers = async (req, res) => {
    let customers = await Customer.findAll({})
    res.status(200).send(customers)
}

// 3. get single customer by id

const getOneCustomer = async (req, res) => {
    let id = req.params.id
    let customer = await Customer.findAll({where: { id: id }})
    res.status(200).send(customer)
}

// 4. update customer by id

const updateCustomer = async (req, res) => {
    let id = req.params.id
    let customer = await Customer.update(req.body, {where: { id: id }})
    res.status(200).send(customer)
}

// 5. delete customer by id

const deleteCustomer = async (req, res) => {
    let id = req.params.id
    await Customer.destroy({where: { id: id }})
    res.status(200).send('Customer is deleted!')
}

module.exports = {
    addCustomer,
    getAllCustomers,
    getOneCustomer,
    updateCustomer,
    deleteCustomer
}