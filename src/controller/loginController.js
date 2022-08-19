import { userDAO } from "../DAO/userDAO.js"
import { hashPassword, isValidPassword } from '../utils/hashPasswords.js'


const loginController = async (req, res) => {
    const invalidFields = false
    const invalidCredentials = false
    await res.render("loginTemplate.ejs", { invalidFields, invalidCredentials })
    
}

const postUserLogin = async (req, res) => {

    req.session.username = req.body.username

    console.log('loginController -> req.session.username: ', req.session.username)

    console.log('Cargo la página loginSuccessTemplate que me hace la redireccion a productos')
    res.render("loginSuccessTemplate.ejs")

} 

export { loginController, postUserLogin }