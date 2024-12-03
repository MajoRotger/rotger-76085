import {Router} from "express"
import ProductManager from "../services/productManager.js"

const router = Router()
const productManager = new ProductManager()

// Ruta para la vista de la página principal
router.get("/home", async (req, res) => {
    try {
        const products = await productManager.getAllProducts()
        res.render("home", { products })
    } catch (error) {
        console.error("Error al obtener productos en home:", error)
        res.render("home", { products: [] });  // Si hay un error, pasar una lista vacía
    }
})

// Ruta para la vista de productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getAllProducts()
    
    res.render("realTimeProducts", { products })
})



export default router