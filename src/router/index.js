import { Router } from "express";
import { productsTest } from "../controller/testController.js";
import { getAllProductsController,getOneProductController, postNewProduct } from "../controller/productsController.js";
import { cartControllerGet, cartControllerPost, cartControllerProductsPost, cartControllerDelete, cartControllerProductDelete } from "../controller/cartController.js";
import { loginController, postUserLogin } from "../controller/loginController.js";
import { registerController, postNewUser } from "../controller/registerController.js";
import { successLoginController } from "../controller/successLoginController.js";
import { loginMiddleware } from "../middleware/loginMiddleware.js";
import { logOutController } from "../controller/logoutController.js";
import { chatController } from "../controller/chatController.js";
import { errorLoginController, errorRegisterController} from "../controller/errorLoginController.js"
import passport from 'passport';

const router = Router()

//Rutas de carritos
router.get('/carts/:id/products', cartControllerGet)
router.post('/carts', cartControllerPost)
router.post('/carts/:id/products', cartControllerProductsPost)
router.delete('/carts/:id', cartControllerDelete)
router.delete('/carts/:id/products/:id_prod', cartControllerProductDelete)

//chat
router.get('/chat', loginMiddleware, chatController)

//Rutas de error login/registro
router.get('/error-login', errorLoginController)
router.get('/error-register', errorRegisterController)

function logPreLoginMiddleware(req, res, next){
    console.log('PreLoginMiddleware')
    next()
}

//Rutas Login
router.get('/login', loginController)
router.get('/loginSuccess', successLoginController)
router.post('/login', 
    passport.authenticate(
        "login", 
        { failureRedirect: "/api/error-login" }
    ), 
    postUserLogin
)

//logout
router.get('/logout', loginMiddleware, logOutController)

//Rutas Registro
router.get('/register', registerController)
router.post('/register',
    passport.authenticate(
        "register", 
        { failureRedirect: "/api/error-register" }
    ), 
    postNewUser
)
router.post('/register', postNewUser)



//Rutas de Producto
router.get('/products', logPreLoginMiddleware, loginMiddleware, getAllProductsController)
router.get('/products/all', logPreLoginMiddleware, loginMiddleware, getAllProductsController)
router.get('/products/:id', loginMiddleware, getOneProductController)
router.post('/products', loginMiddleware, postNewProduct )

//Rutas Test
router.get('/products-test', loginMiddleware, productsTest)





export default router