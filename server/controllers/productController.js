const db = require('../models')

const Product = db.products

// main work

// 1. create product

const addProduct = async (req, res) => {
    let info = {
        name: req.body.name,
        price: req.body.price
    }

    const product = await Product.create(info)
    res.status(200).send(product)
    console.log(product)
}

// 2. get all product

const getAllProducts = async (req, res) => {
    let products = await Product.findAll({})
    res.status(200).send(products)
}

// 3. get single product by id

const getOneProduct = async (req, res) => {
    let id = req.params.id
    let product = await Product.findAll({where: { id: id }})
    res.status(200).send(product)
}

// 4. update product by id

const updateProduct = async (req, res) => {
    let id = req.params.id
    let product = await Product.update(req.body, {where: { id: id }})
    res.status(200).send(product)
}

// 5. delete product by id

const deleteProduct = async (req, res) => {
    let id = req.params.id
    await Product.destroy({where: { id: id }})
    res.status(200).send('Product is deleted!')
}

module.exports = {
    addProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct
}