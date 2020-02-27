const settings = require('../settings');
const mongodb = require('mongodb');

async function getSessionsCollection() {
    const client = await mongodb.MongoClient.connect( settings.mongoUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    return client.db('one-on-one').collection('sessions');
}

async function getParticipantCollection() {
    const client = await mongodb.MongoClient.connect( settings.mongoUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    return client.db('one-on-one').collection('participants');
}

async function deleteSessionById(id){
    sessions = await getSessionsCollection();
    participants = await getParticipantCollection();
    await participants.update({}, {$pull: {"upcoming": id}}, { multi: true })
    await sessions.deleteOne({event_id : id}, {});
    return; 
}

module.exports = {
    deleteSessionById,
    getSessionsCollection
}