const { Router } = require('express')
//const Products = require('../models/product.model')
const products  = require('../services/products.service')
const Carts = require('../services/carts.service')
const HTTP_RESPONSES = require('../constants/http-responses.constant')
const { privateAccess, publicAccess } = require('../middlewares')
const { getUser, checkUserCart } = require('../services/users.service')
const winstonLogger = require('../utils/winston/devLogger.winston')
const factory = require('../utils/winston/factory')




const router = Router()

// ENDPOINT PARA PRODUCTS CON FAKER

router.get('/mockingproducts', async (req, res, next) => {
    try {
        const { page = 1 } = req.query
        const {productsDocs, catArray, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, filter } =  await products.mockProducts(100)
    
    
        const prevLink = `/products?pageon=${prevPage}`
        const nextLink = `/products?pageon=${nextPage}`
    
    
        res.status(200)
            .render('products', {
            status: 'success',
            productsDocs,
            payload: productsDocs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage, 
            hasNextPage,
            prevLink,
            nextLink,
            catArray,
            })
        
    } catch (error) {
        next(error)
    }


})

//

router.get('/',  async (req, res, next) => {
    try {

        const { page = 1 } = req.query
        const { limit, query, sort, cat } = req.query
        let user
        let cartId 
    

        if (req.session.user) {
            const { email } = req.session.user
            user = await getUser(email)
            const userCartId = await checkUserCart(user.id)

            if (userCartId) {
                user.cart = userCartId
                cartId = userCartId
            }
        } else {user = null}
                
        
        
        const {productsDocs, catArray, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, filter } = await products.productsFind(page, limit, sort, cat, query)
    
        const prevLink = `/products?pageon=${prevPage}`
        const nextLink = `/products?pageon=${nextPage}`
        


    
        res.status(200).render('products', {
            status: 'success',
            productsDocs,
            payload: productsDocs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage, 
            hasNextPage,
            prevLink,
            nextLink,
            cartId,
            catArray,
            cat,
            user
            })

        
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res) => {
    try {

        const { title, description, code, price , stock, category, image } = req.body
        
        req.logger.http()

        const newProductData = {
            title,
            description,
            code,
            price,
            stock,
            category,
            image
        }

        

        const newProduct = await products.addProduct(newProductData)

        
        res.json({payload: newProductData})

    } catch (error) {
        console.log({error})
        
    }
    
    
})


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const  body  = req.body

        await User.updateOne({ _id: id, status: true}, body)

        res.json({payload: 'User updated'})
        
    } catch (error) {
        console.log({error})        
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const deletedProd = await Products.deleteProduct(id)
        res.json({payload: deletedProd})
        
    } catch (error) {
        console.log({error})        
    }
})





// ENDPOINT PARA LOGOUT

router.post('/logout', async (req, res) => {

    try {

        req.session.destroy()

        const url = `/login`

        res.json({status: 'Success', message: 'LogOut Succesfull', url })
    } catch (err) {
        console.error('Error logging out:', err);
    }
    
})

module.exports = router




