import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import cors from 'cors'
import initializePassport from './config/passport.js'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import path from 'path';
import { messageModel } from './models/messages.models.js'
import { productModel } from './models/products.models.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import router from './routes/index.routes.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import { addLogger } from './config/logger.js'

const whiteList = ['http://localhost:5173']

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) != -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Acceso denegado"))
        }
    }
}

const app = express()
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = app.listen(PORT, () => {
    console.log(`Servidor puerto: ${PORT}`);
});

const io = new Server(server);

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('BDD conectada')
    })
    .catch(() => console.log('Error en conexion a BDD'))


const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: "Documentacion del curso de Backend",
            description: "API Coder Backend"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60

    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use(addLogger)

app.get('/info', (req, res) => {
    req.logger.info('<span style="color:blue">Texto informativo</span><br/>')
    res.send("Hola!")
})

app.get('/warning', (req, res) => {
    req.logger.warning('<span style="color:cyan">Texto Warning</span><br/>')
    res.send("Hola!")
})

app.get('/error', (req, res) => {
    req.logger.error('<span style="color:yellow">Texto Error</span><br/>')
    res.send("Hola!")
})

app.get('/fatal', (req, res) => {
    req.logger.fatal('<span style="color:red">Texto Fatal</span><br/>')
    res.send("Hola!")
})

io.on('connection', async (socket) => {
    console.log("Servidor Socket.io conectado");
    socket.on('mensajeConexion', (info) => {
        console.log(info);
    });

    try {
        const messages = await messageModel.find().sort({ postTime: 1 }).lean();
        socket.emit('mensajesPrevios', messages);

        const productos = await productModel.find();
        socket.emit('productos', productos);

    } catch (error) {
        console.error('Error al obtener mensajes previos o productos:', error);
    }

    socket.on('enviarMensaje', async (data) => {
        try {
            const newMessage = new messageModel(data);
            await newMessage.save();

            io.emit('mensajeNuevo', newMessage);
        } catch (error) {
            console.error('Error al guardar el mensaje en la base de datos:', error);
        }
    });
});

app.use('/', router)

