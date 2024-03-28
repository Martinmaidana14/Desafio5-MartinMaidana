
//Importaciones
import express from 'express'
import cartRouter from './router/cartRouter.js'
import productsRouter from './router/productsRouter.js'
import userRouter from './router/userRouter.js'
import chatRouter from './router/chatRouter.js'
import upload from './config/multer.js'
import mongoose from 'mongoose'
import messageModel from './models/messages.js'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'


//Definisiones de Importaciones // Configuraciones o declaraciones
const app = express()
const PORT = 4000

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server)//Va a estar declarado un nuevo servidor de socket io

//Connection DB
mongoose.connect("mongodb+srv://martinmaidana28:coderhouse@cluster0.cuczn8s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("DB is connected"))
    .catch(e => console.log(e))

//Permite poder ejecutar JSON // Middlewares
app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

/*
//Establecer comunicacion para que pueda ingresarme informacion y yo pueda enviar informacion hacia lo que seria mi Cliente
io.on('connection', (socket) => {//Apreton de manos
    console.log("Conexion con Socket.io")

    socket.on('movimiento', info => { //Cuando el cliente me envia un mensaje, lo capturo y lo muestro
        console.log(info)
    })
    socket.on('rendirse', info => { //Cuando el cliente me envia un mensaje, lo capturo y lo muestro
        console.log(info)
        socket.emit('mensaje-jugador', "Te has rendido") //Cliente que envio este mensaje
        socket.broadcast.emit('rendicion', "El jugador se rindio") //Los Clientes que tengan establecida la comunicacion con el servidor
    })
})
*/
io.on('connection', (socket) => {
    console.log("Conexion con Socket.io")
//Msj
    socket.on('mensaje', async (mensaje) => {
        try {
            await messageModel.create(mensaje)
            const mensajes = await messageModel.find()
            io.emit('mensajeLogs', mensajes)
        } catch (e) {
            io.emit('mensajeLogs', e)
        }
    })
})

//Routes
app.use('/public', express.static(__dirname + '/public'))
app.use('/api/products', productsRouter, express.static(__dirname + '/public'))
app.use('/api/cart', cartRouter)
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'))
app.use('/api/users', userRouter)

app.post('/upload', upload.single('product'), (req, res) => {
    try {
        console.log(req.file)
        res.status(200).send("Imagen cargada correctamente")
    } catch (e) {
        res.status(500).send("Error al cargar imagen")
    }
})
/*
app.get('/static', (req, res) => {

    const prods = [
        { id: 1, title: "Celular", price: 1500, img: "./img/170899824248166585_7797470128152.jpg" },
        { id: 2, title: "Televisor", price: 1800, img: "https://www.radiosapienza.com.ar/Image/0/500_500-526469_1.jpg" },
        { id: 3, title: "Tablet", price: 1200, img: "https://www.radiosapienza.com.ar/Image/0/500_500-526469_1.jpg" },
        { id: 4, title: "Notebook", price: 1900, img: "https://www.radiosapienza.com.ar/Image/0/500_500-526469_1.jpg" }
    ]

})
*/