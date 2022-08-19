const errorLoginController = async (req, res) => {

    res.render("errorLoginTemplate.ejs")
}
const errorRegisterController = async (req, res) => {

    res.render("errorRegisterTemplate.ejs")
}

export { errorLoginController, errorRegisterController }