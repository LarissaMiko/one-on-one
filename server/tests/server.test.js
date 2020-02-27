const http = require("../server");
const request = require("supertest");


http.listen(5000);

const GoodPostSessionBody = {
	"id" : "testsession",
	"startDate" : "Mon Feb 24 2020 10:00:00 GMT+0100 (Mitteleuropäische Normalzeit)",
	"endDate" : "Mon Feb 24 2020 10:50:00 GMT+0100 (Mitteleuropäische Normalzeit)",
	"participants" : ["user1", "user2", "user3", "user4"]
}
// endDate before startDate
const BadPostSessionBody1 = {
	"id" : "testsession",
	"startDate" : "Mon Feb 24 2020 11:30:00 GMT+0100 (Mitteleuropäische Normalzeit)",
	"endDate" : "Mon Feb 24 2020 10:50:00 GMT+0100 (Mitteleuropäische Normalzeit)",
	"participants" : ["user1", "user2", "user3", "user4"]
}
// invalid date
const BadPostSessionBody2 = {
	"id" : "testsession",
	"startDate" : "Mon Feb 24 2020 10:00:00 GMT+0100 (Mitteleuropäische Normalzeit)",
	"endDate" : "Mon Feb 24 2020 10:80:00 GMT+0100 (Mitteleuropäische Normalzeit)",
	"participants" : ["user1", "user2", "user3", "user4"]
}

//Test POST-request to /start endpoint
describe('POST /start' , () => {

  it('Not create event when start is after end', async () => {
    const res = await request(http)
    .post('/start')
    .send(BadPostSessionBody1)
    expect(res.statusCode).toEqual(400)
  })
  it('Not create event when startDate or endDate invalid', async () => {
    const res = await request(http)
    .post('/start')
    .send(BadPostSessionBody2)
    expect(res.statusCode).toEqual(400)
  })
  it('Create valid session', async () => {
    const res = await request(http)
    .post('/start')
    .send(GoodPostSessionBody)
    expect(res.statusCode).toEqual(201)
  })
})

//Test POST-request to /newuser endpoint
const GoodPostUserBody = {
	"id" : "testuser",
	"title" : "",
	"gender" : "Mann",
	"firstname" : "Max",
	"lastname" : "Mustermann",
	"username" : "MaxMuster",
	"email" : "max.mustermann@gmail.com",
	"organisation" : "LMU",
	"city": "",
	"country" : "",
	"fieldOfActivity" : "Informatiker",
	"researchInterest" : ["Artificial Intelligence", "Natural language processing", "Hardware, Power and Energy", "Human Computer Interaction"]
}

const BadPostUserBody1 = {
	"id" : "",
	"title" : "",
	"gender" : "Frau",
	"firstname" : "Max",
	"lastname" : "Mustermann",
	"username" : "MaxMuster",
	"email" : "max.mustermann@gmail.com",
	"organisation" : "LMU",
	"city": "",
	"country" : "",
	"fieldOfActivity" : "Informatiker",
	"researchInterest" : ["Artificial Intelligence", "Natural language processing", "Hardware, Power and Energy", "Human Computer Interaction"]
}


describe('POST /newuser' , () => {

  it('Not create user with empty id', async () => {
    const res = await request(http)
    .post('/newuser')
    .send(BadPostUserBody1)
    expect(res.statusCode).toEqual(400)
  })
  it('Create valid user', async () => {
    const res = await request(http)
    .post('/newuser')
    .send(GoodPostUserBody)
    expect(res.statusCode).toEqual(201)
  })
})

//Test GET-request to /user/:user_id endpoint
const GetTestuserBody = {
  "_id": "5e4a794527486f27fc2fab18",
  "user_id": "testuser",
  "title": "",
  "gender": "Mann",
  "firstname": "Max",
  "lastname": "Mustermann",
  "email": "max.mustermann@gmail.com",
  "organisation": "LMU",
  "city": "",
  "country": "",
  "fieldOfActivity": "Informatiker",
  "researchInterest": [
      "Artificial Intelligence",
      "Natural language processing",
      "Hardware, Power and Energy",
      "Human Computer Interaction"
  ],
  "upcoming": []
}

describe('GET /user/:user_id', () => {

  it('Gets user that exists in database', async () => {
    const res = await request(http)
    .get('/user/testuser')
    expect(res.statusCode).toEqual(200);
    expect(res.body).toStrictEqual(GetTestuserBody);
  })

  it('Does not get user that is not in database', async () => {
    const res = await request(http)
    .get('/user/notatestuser')
    expect(res.statusCode).toEqual(404);
  })
})


//Test GET-request to /session/:event_id endpoint

const getTestsessionBody = {
  "_id": "5e4aa3145a79a32f05b41e15",
  "event_id": "testsession",
  "startDate": "Mon Feb 24 2020 10:00:00 GMT+0100 (Mitteleuropäische Normalzeit)",
  "endDate": "Mon Feb 24 2020 10:50:00 GMT+0100 (Mitteleuropäische Normalzeit)",
  "participants": [
      "user1",
      "user2",
      "user3",
      "user4"
  ],
  "matches": [
      [
          [
              "user1",
              "user3"
          ],
          [
              "user2",
              "user4"
          ]
      ],
      [
          [
              "user1",
              "user4"
          ],
          [
              "user2",
              "user3"
          ]
      ]
  ],
  "rounds": 2
}

describe('GET /session/:session_id', () => {

  it('Gets user that exists in database', async () => {
    const res = await request(http)
    .get('/session/testsession')
    expect(res.statusCode).toEqual(200);
    expect(res.body).toStrictEqual(getTestsessionBody);
  })

  it('Does not get session that is not in database', async () => {
    const res = await request(http)
    .get('/session/notatestsession')
    expect(res.statusCode).toEqual(404);
  })
})

//Test DELETE-request to /session/:event_id enpoint

describe('DELETE /session/:session_id', () => {

  it('Delete user that is in Database', async () => {
    const res = await request(http)
    .delete('/session/testsession')
    expect(res.statusCode).toEqual(200);
  })
})













