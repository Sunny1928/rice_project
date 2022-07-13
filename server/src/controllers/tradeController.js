const db = require('../models')

const Trade = db.trades

// main work

// 1. create trade

const addTrade = async (req, res) => {
    let info = {
        name: req.body.name,
        amount: req.body.amount,
        package: req.body.package,
        customer_name: req.body.customer_name,
        user_name: req.body.user_name
    }

    const trade = await Trade.create(info)
    res.status(200).send(trade)
    //console.log(trade)
}

// 2. get all trade

const getAllTrades = async (req, res) => {
    let trades = await Trade.findAll({})
    res.status(200).send(trades)
}

// 3. get single trade by id

const getOneTrade = async (req, res) => {
    let id = req.params.id
    let trade = await Trade.findAll({where: { id: id }})
    res.status(200).send(trade)
}

// 4. update trade by id

const updateTrade = async (req, res) => {
    let id = req.params.id
    let trade = await Trade.update(req.body, {where: { id: id }})
    res.status(200).send(trade)
}

// 5. delete trade by id

const deleteTrade = async (req, res) => {
    let id = req.params.id
    await Trade.destroy({where: { id: id }})
    res.status(200).send('Trade is deleted!')
}

module.exports = {
    addTrade,
    getAllTrades,
    getOneTrade,
    updateTrade,
    deleteTrade
}