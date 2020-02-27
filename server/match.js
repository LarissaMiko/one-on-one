const mongodb = require('mongodb')
const settings = require('../settings')

function make_matches(participants, session_id, start, end){
    //calculate duration of session
    var startDate = new Date(start);
    var endDate = new Date(end);
    var duration = (endDate.getTime() - startDate.getTime())/1000;

    //calculate rounds based on participant number
    var participant_number = participants.length
    var possible_rounds = Math.ceil(participant_number/2)
    var rounds = Math.min(possible_rounds, duration/180);

    var matches = []
    var group1 = []
    var group2 = []

    //devide participants into 2 groups for speed dating
    if(participants.length %2 == 0){
        group1 = participants.slice(0, participant_number/2)
        group2 = participants.slice(participant_number/2)
    } else {
        //if participant numver is odd add a 0 to the end of the array
        participants.push(0)
        group1 = participants.slice(0, Math.ceil(participant_number/2))
        group2 = participants.slice(Math.ceil(participant_number/2))
    }

    let part_array = []

    //calculate matches for each round
    for (let j = 0; j<rounds; j++){
        part_array = []
        //get 1 person of each array
        for(let i = 0; i<group1.length; i++){
            part_array.push([group1[i], group2[i]])
        }
        //shift the second array to get new chat partner
        group2.push(group2.shift())
        matches.push(part_array)
    }
    //save matches in database
    updateSessions()
    return matches

    async function getSessionsCollection() {
        const client = await mongodb.MongoClient.connect( settings.mongoUrl, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    
        return client.db('one-on-one').collection('sessions');
    }
        
    async function updateSessions(){
        const sessions = await getSessionsCollection()
        await sessions.updateOne(
            {event_id: session_id},
            {
                $set: {
                    'rounds': rounds,
                    'matches': matches
                }
            }
        )
    }
  
}



module.exports = {
    make_matches
}

