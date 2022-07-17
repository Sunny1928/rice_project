const db = require('../models')

const CashMethod  = db.cashMethods

// main work

// 1. create cashMethod

const addCashMethod  = async (req, res) => {
    let info = {
        name: req.body.name
    }

    const cashMethod = await CashMethod .create(info)
    res.status(200).send(cashMethod)
    //console.log(cashMethod)
}

// 2. get all cashMethod

const getAllCashMethods = async (req, res) => {
    let cashMethods = await CashMethod .findAll({})
    res.status(200).send(cashMethods)
}

// 3. get single cashMethod by id

const getOneCashMethod  = async (req, res) => {
    let id = req.params.id
    let cashMethod = await CashMethod .findAll({where: { id: id }})
    res.status(200).send(cashMethod)
}

// 4. update cashMethod by id

const updateCashMethod = async (req, res) => {
    let id = req.params.id
    let cashMethod = await CashMethod .update(req.body, {where: { id: id }})
    res.status(200).send(cashMethod)
}

// 5. delete cashMethod  by id

const deleteCashMethod  = async (req, res) => {
    let id = req.params.id
    await CashMethod .destroy({where: { id: id }})
    res.status(200).send('CashMethod  is deleted!')
}

module.exports = {
    addCashMethod ,
    getAllCashMethods,
    getOneCashMethod ,
    updateCashMethod ,
    deleteCashMethod 
}