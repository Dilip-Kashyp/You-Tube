const mongooes = require('mongoose')
const { DB_NAME } = require('../constants')

const connectionDB = async () => {
    try {
        const connect = await mongooes.connect(`mongodb+srv://dilipkumar491249:UKMhGETYcJlOaIyk@cluster0.zb1foow.mongodb.net/${DB_NAME}`);
        console.log(`Mongooes connected !! DB_Host  ${connect.connection.host}`)
    } catch (error) {
        console.log("Mongooes error :", error);

    }
}

module.exports = { connectionDB }