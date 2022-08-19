const loginMiddleware = (req, res, next) => {
    const { username } = req.session

    console.log('Entro al LoginMiddleware')
    console.log('username: ', username)

    if(!username) {
        return res.redirect("/api/login")
    } else {
        console.log(`Ingreso el usuario ${username}`)
        return next()
    }
}

export { loginMiddleware }