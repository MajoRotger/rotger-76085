import fs from "fs/promises"
import path from "path"

const productsFilePath = path.resolve("data", "products.json")  

export default class ProductManager {

    //Constructor
    constructor() {
        this.products = []
        this.init()
    }

    async init() {
        try {
            const data = await fs.readFile(productsFilePath, "utf-8")
            this.products = JSON.parse(data)
        }
        catch (error) {
            this.products = []
        }
    }

    // ** METODOS ** 

    async saveToFile() {
        const jsonData = JSON.stringify(this.products, null, 2)
        await fs.writeFile(productsFilePath, jsonData)
    }

    //getAllProducts
    async getAllProducts(limit) {
        if(limit){
            return this.products.slice(0, limit)
        }
        return this.products
    }

    //getProductById
    async getProductById(pid) { 
        return this.products.find(product => product.id === pid)
    }

    //addProduct
    async addProduct(product) {
        const newProduct = {
            id: this.products.length ? this.products[this.products.length - 1].id + 1 : 1, ...product, status: true, 
        }
        this.products.push(newProduct)
        this.saveToFile()
        return newProduct
    }


    //updateProduct
    async updateProduct(id, updatedData) {
         const productIndex = this.products.findIndex(product => product.id === id)
         if(productIndex === -1) return null
         const updatedProduct = {
            ...this.products[productIndex],
            ...updatedData,
            id: this.products[productIndex].id,
         }
         this.products[productIndex] = updatedProduct
         this.saveToFile()
         return updatedProduct
    }

    //deleteProduct
    async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id)
        if(productIndex === -1) return null
        const deleteProduct = this.products.splice(productIndex, 1)
        this.saveToFile()
        return deleteProduct[0]
    }
}
