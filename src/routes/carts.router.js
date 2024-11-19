import {Router} from "express"
import CartManager from "../services/cartManager.js"
import ProductManager from "../services/productManager.js"

const router = Router()

const cartManager = new CartManager()
const productManager = new ProductManager()

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
    try {
      const newCart = cartManager.createEmptyCart()
      res.status(201).json(newCart)
    } catch (error) {
        console.log(error)
    }
})

// Ruta para obtener los productos de un carrito por su ID
router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid)
    console.log(cartId)
    if (isNaN(cartId)) {
      return res.status(400).json({ message: 'El ID del carrito no es válido' });
    }
    try {
      const cart = cartManager.getCartById(cartId)
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' })
      }
      res.status(200).json(cart.products)
    } catch (error) {
        console.log(error)
    }
})

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid)
    const productId = parseInt(req.params.pid)
    if (isNaN(cartId) || isNaN(productId)) {
      return res.status(400).json({ message: 'El ID del carrito o del producto no es válido' })
    }
    try {
      const updatedCart = await cartManager.addProductToCart(cartId, productId)
      res.status(200).json(updatedCart);
    } catch (error) {
        // Si ocurre un error (producto no encontrado, carrito no encontrado, etc.), respondemos con el error
        res.status(400).json({ message: error.message })
  
    }
})



export default router;