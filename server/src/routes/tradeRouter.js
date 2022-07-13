const tradeController = require('../controllers/tradeController')

const router = require('express').Router()

router.post('/addTrade', tradeController.addTrade)
router.get('/allTrades', tradeController.getAllTrades)

router.get('/:id', tradeController.getOneTrade)
router.put('/:id', tradeController.updateTrade)
router.delete('/:id', tradeController.deleteTrade)

module.exports = router