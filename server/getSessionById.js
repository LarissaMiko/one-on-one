const settings = require('../settings');
const mongodb = require('mongodb');

async function getSessionsCollection() {
    const client = await mongodb.MongoClient.connect( settings.mongoUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    return client.db('one-on-one').collection('sessions');
}

async function getSessionById(id){
    participants = await getSessionsCollection();
    return await participants.findOne({event_id : id}, {});
}

module.exports = {
    getSessionById
}