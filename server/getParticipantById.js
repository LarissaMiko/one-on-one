const settings = require('../settings');
const mongodb = require('mongodb');

async function getParticipantsCollection() {
    const client = await mongodb.MongoClient.connect( settings.mongoUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    return client.db('one-on-one').collection('participants');
}

async function getParticipantById(id){
    participants = await getParticipantsCollection();
    return await participants.findOne({user_id : id}, {});
}

module.exports = {
    getParticipantById
}