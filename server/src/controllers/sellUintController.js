const db = require('../models')

const SellUint = db.sellUints

// main work

// 1. create sellUint

const addSellUint = async (req, res) => {
    let info = {
        name: req.body.name
    }

    const sellUint = await SellUint.create(info)
    res.status(200).send(sellUint)
    //console.log(sellUint)
}

// 2. get all sellUint

const getAllSellUints = async (req, res) => {
    let sellUints = await SellUint.findAll({})
    res.status(200).send(sellUints)
}

// 3. get single sellUint by id

const getOneSellUint = async (req, res) => {
    let id = req.params.id
    let sellUint = await SellUint.findAll({where: { id: id }})
    res.status(200).send(sellUint)
}

// 4. update sellUint by id

const updateSellUint = async (req, res) => {
    let id = req.params.id
    let sellUint = await SellUint.update(req.body, {where: { id: id }})
    res.status(200).send(sellUint)
}

// 5. delete sellUint by id

const deleteSellUint = async (req, res) => {
    let id = req.params.id
    await SellUint.destroy({where: { id: id }})
    res.status(200).send('SellUint is deleted!')
}

module.exports = {
    addSellUint,
    getAllSellUints,
    getOneSellUint,
    updateSellUint,
    deleteSellUint
}