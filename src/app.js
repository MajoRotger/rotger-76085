import express from "express"
import handlebars from "express-handlebars"
import productsRoutes from "./routes/products.routes.js"
import cartsRoutes from "./routes/carts.routes.js"
import viewsRoutes from "./routes/views.routes.js"
import ProductManager from "./services/productManager.js"
import __dirname from "./utils.js"
import { Server } from "socket.io"

const app = express()
const SERVER_PORT = 8080

const productManager = new ProductManager()

app.use(express.json())

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


app.use(express.static(__dirname + "/public"))

app.use("/api/products", productsRoutes)

app.use("/api/carts", cartsRoutes)

app.use("/", viewsRoutes)

const httpServer = app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT)
} )

const socketServer = new Server(httpServer)

app.set("socketServer", socketServer)

let products = []  

socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado")

    // Emitir toda la lista de productos al cliente cuando se conecta
   socket.emit("actualizar-productos", { products })

    // Cuando un cliente solicita agregar un nuevo producto
    socket.on("nuevo-producto", async data => {
        console.log("Nuevo producto recibido:", data)

        products = await productManager.getAllProducts()

        // Agregar el nuevo producto al listado global
        products.push(data)

        // Emitir la lista completa de productos a todos los clientes conectados
        socketServer.emit('actualizar-productos', { products })
    })
})
