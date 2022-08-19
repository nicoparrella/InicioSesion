import { userDAO } from "../DAO/userDAO.js"
import { hashPassword, isValidPassword } from '../utils/hashPasswords.js'

const registerController = async (req, res) => {

    const invalidFields=false 
    const invalidPassword=false 
    const invalidUser=false

    await res.render("registerTemplate.ejs", { invalidFields, invalidPassword, invalidUser })
    
}

const postNewUser = async (req, res) => {

    console.log("Redirijo a la página de login")
    

    return res.redirect("/api/login")
}

export { registerController, postNewUser }