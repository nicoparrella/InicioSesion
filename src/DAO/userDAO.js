import { User } from "../models/userModel.js"

const userDAO = {

    async getById(id) {
        const doc = await User.findOne( { _id: id } )
        return doc
    },

    async getByEmail(email) {
        const doc = await User.findOne( { email: email } )
        return doc
    },

    async getByUsername(username) {
        const doc = await User.findOne( { username: username } )
        return doc
    },

    // async getByUsernameAndPassword(username, password) {
    //     const doc = await User.find( { username: username, password:password } )
    //     return doc
    // },

    async getAll(){
        const doc = await User.find({})
        return doc
    },

    async createDocument(document){
        const doc = await User.insertMany(document)
        return doc[0]._id
    },

    async updateDocument(id, paramsToUpdate){
        const doc = await User.updateOne({ _id: id }, {$set: paramsToUpdate})
        return "Documento actualizado en la base :)"
    },

    async deleteById(id){
        const doc = await User.deleteOne({ _id: id })
        return "Documento eliminado de la base :)"
    }

}

export { userDAO }