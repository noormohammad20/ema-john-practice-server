const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const res = require('express/lib/response')
require("dotenv").config()
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_PRODUCTS}:${process.env.DB_PASS}@cluster0.acdjr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
async function run() {
    try {
        await client.connect()
        const productsCollection = client.db('ema-john-practice').collection('products')

        app.get('/product', async (req, res) => {
            console.log('query', req.query)
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const query = {}
            const cursor = productsCollection.find(query)
            let products
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray()

            }
            else {
                products = await cursor.toArray()
            }

            res.send(products)
        })

        app.get('/productCount', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount()
            res.send({ count })
        })

        //use post to get products by ids
        app.post('/productByKeys', async (req, res) => {
            const keys = req.body
            const ids = keys.map(id => ObjectId(id))
            const query = { _id: { $in: ids } }
            const cursor = productsCollection.find(query)
            const products = await cursor.toArray()
            console.log(keys)
            res.send(products)
        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log('form port', port)
})