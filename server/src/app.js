const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

require('dotenv').config()

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())



//routers
const productRouter = require('./routes/productRouter')
const userRouter = require('./routes/userRouter')
const customerRouter = require('./routes/customerRouter')
const tradeRouter = require('./routes/tradeRouter')


app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/customers', customerRouter)
app.use('/api/trades', tradeRouter)




app.post('/register', (req, res)=>{
    res.send({
        message: `Hello ${req.body.account}!`
    })
})


app.listen(process.env.PORT || 8089)