const mongodb = require('mongodb');
const settings = require('../settings');

async function getParticipantsCollection() {
    const client = await mongodb.MongoClient.connect(settings.mongoUrl, {
        useNewUrlParser: true
    });

    return client.db('one-on-one').collection('participants');
}

async function createUser(req) {
    //user id required to continue
    if(req.body.id == "") {
        return(400);
    } else {
        //check if participant already exists in database
        const participants = await getParticipantsCollection()
    participants.findOne({ user_id: req.body.user_id }, function (err, data) {
        if (data !== null) {
            var newvalues = { $set: {
                user_id : req.body.user_id,
                title : req.body.title,
                gender: req.body.gender,
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                organisation : req.body.organisation,
                city : req.body.city,
                country : req.body.country,
                fieldOfActivity : req.body.fieldOfActivity,
                researchInterest : req.body.researchInterest, 
            } };

            participants.updateOne({ user_id: req.body.user_id }, newvalues, function(err, res) {
                if(err) throw err;
            })

        } else {
            //if participant does not exist yet, create new entry
            participants.insertOne({
                user_id : req.body.user_id,
                title : req.body.title,
                gender: req.body.gender,
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                organisation : req.body.organisation,
                city : req.body.city,
                country : req.body.country,
                fieldOfActivity : req.body.fieldOfActivity,
                researchInterest : req.body.researchInterest,
                upcoming : []
            }
            )
        }
    })

    return(201);

    }
    
}

module.exports = {
    createUser
}
            