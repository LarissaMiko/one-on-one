//update participants when new session is posted
const mongodb = require('mongodb');
const settings = require('../settings');

//establish database connection
async function getParticipantsCollection() {
    const client = await mongodb.MongoClient.connect(settings.mongoUrl, {
        useNewUrlParser: true
    });

    return client.db('one-on-one').collection('participants');
}
//update participants when session is posted
async function updateParticipants(new_participants, event_id) {
    const participants = await getParticipantsCollection()
    
    //look if participant with this id already exists
    new_participants.forEach(participant => {
        participants.findOne({ user_id: participant }, function (err, data) {
            if (data !== null) {
                //if participant exists update the existing participant
                participants.updateOne(
                    { "user_id": participant }, // specifies the document to update
                    {
                        //set new values
                        $push: { "upcoming": event_id },
                    }
                )
            } else {
                //if participant does not exist insert a new one
                participants.insertOne({
                        user_id: participant,
                        upcoming: [event_id]
                })
            
            }

        })
    });
}

module.exports = { 
    updateParticipants 
}