# One-on-One Microservice

Welcome to the One-on-one-Chat microservice. Our events consist a series of short anonymous chats for participants of a conference.

## How to set up a new Chat-Session

Send a HTTP-POST request to https://pwp.um.ifi.lmu.de/g06/start that contains the event-id, start date, end date and the list of users that are attending. Example of request body:

```
{
	"id" : "event_id",
	"startDate" : "Wed Feb 12 2020 12:30:00 GMT+0100 (Mitteleuropäische Normalzeit)",
	"endDate" : "Wed Feb 12 2020 13:24:00 GMT+0100 (Mitteleuropäische Normalzeit)",
	"participants" : ["user1", "user2", "user3", "user4"]
}

```
## How to use our microservice

From the Scheduling Management you will be redirected to https://pwp.um.ifi.lmu.de/g06/#/your-user-id. There you can check whether there is a chat-session coming up for you.

If you have a chat-session upcoming, you will see when it starts. If you are in a running chat session, you will be guided through the rounds by the Timer. In each round you first have the possibilty to read the interests of your chatpartner, followed by a two minute chat. After each round you can decide whether you want to show your contact details. You will see your partner's contact details if he chooses to show them - in the current version mind to write them down or take a screenshot to keep them for later.


## How to use on localhost

```
npm install
```
make sure that the settings.js is commented like this:

```
//DEV
const serverPort = 5000;
const ApiUrl = `http://localhost:${serverPort}`;
const socket = io("localhost:5000");

//PROD
//const serverPort = 10006;
//const ApiUrl = `https://pwp.um.ifi.lmu.de/g06`;
//const socket = io("https://pwp.um.ifi.lmu.de", {path: "/g06/socket.io"});
```

Open two console windows and navigate to the one-on-one folder in both of them.
In the first one run:

```
node server
```
In the second one:

```
npm run serve
```

Then the server is running on port 5000 and the frontend application will be on port 8080.
You can post new sessions to the endpoint http://localhost:5000/start.

#### Using the application with own users

If you want to try the application by posting a session with own users (or mock users), you need to comment the created() function in the home.vue in the following way to make sure that the application is not expecting cookie-information about the user.

```
async created(){
  /*var user = this.$cookies.get("user");
  //post user-information to database
    await axios.post(`${settings.ApiUrl}/newuser`, {
        "user_id" : user.id,
        "title" : user.title,
        "gender" : user.gender,
        "username" : user.username,
        "firstname" : user.firstname,
        "lastname" : user.lastname,
        "email" : user.email,
        "organisation" : user.organisation,
        "country" : user.country,
        "fieldOfActivity" : user.fieldOfActivity,
        "researchInterest" : user.researchInterest,
      })*/
    //retrieve user-information from database
    await this.getUser();
    //find next chatSession of user
    await this.getNextSession();
    //find chatStatus of next ChatSession
    await this.getSessionStatus();
    
  },
```
Using the application like this there will be no further particiant-information visible but the chat functionality can be tested.

## How to deploy our application

Navigate into one-on-one folder on the server and run

```
npm install
```

make sure that the settings.js is commented like this (adapt the URLs where necessary):

```
//DEV
//const serverPort = 5000;
//const ApiUrl = `http://localhost:${serverPort}`;
//const socket = io("localhost:5000");

//PROD
const serverPort = 10006;
const ApiUrl = `https://pwp.um.ifi.lmu.de/g06`;
const socket = io("https://pwp.um.ifi.lmu.de", {path: "/g06/socket.io"});
```
check that the vue.config.js looks like this (Change path correspondng to your needs):

```
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/g06/'
    : '/'
}
```

### Compile and minifie for production
```
npm run build
```
### Start server with pm2

```
pm2 start server
```

### Instructions for testing the application
#### Test Frontend

Go to package.json and change the jest options to:
```
"jest": {
    "preset": "@vue/cli-plugin-unit-jest"
  }
```
then go to console and enter
```
npm run test
```

#### Test Backend

Go to package.json and change the jest options to:
```
"jest": {
    "preset": "@shelf/jest-mongodb",
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ]
  }
```
then go to console and enter
```
npm run test
```