const mongodb = require('mongodb');
const settings = require('../settings');
const moment = require('moment');

//establish database connection
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
    
//update session when post request to /start is received
async function updateSessions(req){
    const sessions = await getSessionsCollection()
    const participants = await getParticipantCollection();

    const start = moment(req.body.startDate);
    const end = moment(req.body.endDate);

    //check if startDate is before endDate
        if(moment(start).isValid() && moment(end).isValid() && moment(end).isAfter(start)){
    
            sessions.findOne({ event_id: req.body.id }, function (err, data) {
                if (data !== null) {
                    //if session exists update the existing session
                    sessions.updateOne(
                        { "event_id": req.body.id }, // specifies the document to update
                        {
                            //set new values
                            $set: {
                                event_id: req.body.id,
                                startDate : req.body.startDate,
                                endDate : req.body.endDate,
                                participants : req.body.participants,
                            },
                        }
                    )
                    participants.updateMany({}, {$pull: {"upcoming": req.body.id}}, { multi: true })
                } else {
                    //if session does not exist insert a new one
                    sessions.insertOne({
                        event_id: req.body.id,
                        startDate : req.body.startDate,
                        endDate : req.body.endDate,
                        participants : req.body.participants,
                    })
                }
        
            })
            return(201);

        } else {
            
            return(400);
        }
        
}

module.exports = { updateSessions }