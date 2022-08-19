import path from 'path';
import express from 'express'
import routes from './router/index.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import mongoose from 'mongoose';
import { hashPassword, isValidPassword } from './utils/hashPasswords.js'

import { Server } from 'socket.io'
import { chatDAO } from './DAO/chatDAO.js';
import { userDAO } from './DAO/userDAO.js';
import { dirname } from 'path';
import { mongodbURL } from './database/config.js';
import { fileURLToPath } from 'url';
import { normalizedMessages } from './utils/normalize.js';

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

await mongoose.connect(mongodbURL.connectionString)
console.log("Conectado a la base Mongo")

//server
const expressServer = app.listen(8080, () => {
    console.log('Server escuchando en el puerto 8080')
})

const io = new Server(expressServer)

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

app.use(cookieParser());
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: mongodbURL.connectionString,
            mongoOptions,
        }),
        secret: "coderhouse",
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 10000,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

const loginStrategy = new LocalStrategy(
    { passReqToCallback: true },
    async (req, email, password, done) => {
        //async (req, done) => {
        try {
            const dbuser = await userDAO.getByEmail(req.body.email)

            if (!dbuser || !isValidPassword(req.body.password, dbuser.password)) {
                return done(null, null);
            }

            done(null, dbuser);

        } catch (err) {
            console.log("Error al loguear el usuario", err);
            done("Error al loguear el usuario", null);
        }
    });

const registerStrategy = new LocalStrategy(
    { passReqToCallback: true },
    async (req, email, password, done) => {
        try {
            const existingUser = await userDAO.getByEmail(req.body.email)
            if (existingUser) {
                return done(null, null);
            }
            const newUser = {
                email: req.body.email,
                password: hashPassword(password),
                username: req.body.username,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            };

            const createdUser = await userDAO.createDocument(newUser);

            done(null, createdUser);
        } catch (err) {
            console.log("Error al registrar el usuario", err);
            done("Error al registrar el usuario", null);
        }
    }
);

passport.use("login", loginStrategy);
passport.use("register", registerStrategy);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    userDAO.getById(id, done);
});

const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, './views')));

app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')

io.on('connection', async socket => {
    console.log(`Se conecto el cliente con id: ${socket.id}`)

    const messagesFromDB = await chatDAO.getAll()
    const normalizedChat = normalizedMessages(messagesFromDB)

    socket.emit('server:renderMessages', normalizedChat)

    socket.on('client:newMessage', async (messageInfo) => {
        await chatDAO.postMessage(messageInfo)

        const messagesFromDB = await chatDAO.getAll()
        const normalizedChat = normalizedMessages(messagesFromDB)
        io.emit('server:renderMessages', normalizedChat)
    })
})

app.use('/api', routes)