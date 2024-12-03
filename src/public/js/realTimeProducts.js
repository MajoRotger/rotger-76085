const socket = io()

let products = []

const form = document.getElementById("registerForm")

form.addEventListener("submit", e => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(result => {
        if (result.status === 201) {
            result.json().then(json => {
              //Emitir el evento con los datos del nuevo producto
            socket.emit("nuevo-producto", json)  // Emite el evento recibido con el JSON 
            })

            alert("Producto creado con exito!")

            // Limpiar el formulario
            form.reset()
        } else {
            alert("No se pudo crear el producto!")
        }
    })
    .catch(error => {
        console.error("Error al crear producto:", error)
        alert("Hubo un error al crear el producto.")
    })
})

// Escuchar el evento "actualizar-productos" y actualizar el DOM
socket.on("actualizar-productos", (data) => {
    // Limpiar la lista actual de productos en el DOM
    const productList = document.getElementById("productList")
    productList.innerHTML = ''  // Limpiar la lista de productos visible en el DOM

    // Actualizar el array de productos con los nuevos datos recibidos
    products = data.products || [] 

    // Ahora, iteramos sobre 'products' y los mostramos en el DOM
    products.forEach(product => {
        const li = document.createElement("li")
        li.textContent = `${product.title} - ${product.description} - $${product.price}`
        productList.appendChild(li)
    })
    
})
