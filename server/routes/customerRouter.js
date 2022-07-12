const customerController = require('../controllers/customerController')

const router = require('express').Router()

router.post('/addCustomer', customerController.addCustomer)
router.get('/allCustomers', customerController.getAllCustomers)

router.get('/:id', customerController.getOneCustomer)
router.put('/:id', customerController.updateCustomer)
router.delete('/:id', customerController.deleteCustomer)

module.exports = router