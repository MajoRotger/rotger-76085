import fs from "fs/promises"
import path from "path"
import ProductManager from "./productManager.js"

const cartsFilePath = path.resolve("data", "carts.json")  

export default class CartManager {
    //Constructor
    constructor() {
        this.carts = []
        this.init()
        this.productManager = new ProductManager()
    }
    async init() {
        try {
            const data = await fs.readFile(cartsFilePath, "utf-8")
            this.carts = JSON.parse(data)
        }
        catch (error) {
            this.carts = []
        }
    }

    // ** METODOS ** 

    async saveToFile() {
        const jsonData = JSON.stringify(this.carts, null, 2)
        await fs.writeFile(cartsFilePath, jsonData)
    }
    
    //createEmptyCart
    createEmptyCart() {
        const newCart = {
          id: Date.now(),
          products: []
        }
        this.carts.push(newCart)
        this.saveToFile()
        return newCart
    }

    //getCartById
    getCartById(cid) {
        return this.carts.find(cart => cart.id === parseInt(cid))
    }

    //addProductToCart
    async addProductToCart(cid, pid) {
        try {
             // Verificamos si el producto existe
            const product = await this.productManager.getProductById(pid)
            if (!product) {
                throw new Error('Id de producto no valido')
            }

            const cart = this.getCartById(cid)
            if (!cart) {
                throw new Error('Carrito no encontrado')
            }
        
            // Verificamos si el producto ya existe en el carrito
            const productIndex = cart.products.findIndex(p => p.product === pid)
            if (productIndex !== -1) {
                // Si ya existe, incrementamos la cantidad
                cart.products[productIndex].quantity += 1
            } else {
                // Si no existe, lo agregamos con cantidad 1
                cart.products.push({ product: pid, quantity: 1 })
            }
            this.saveToFile()
            return cart
        } catch (error) {
            // Si ocurre un error, lo lanzamos de nuevo para ser capturado en el router
            throw new Error(error.message)
        }
       
    }

    //getAllCarts
    getAllCarts() {
        return this.carts
    }
}