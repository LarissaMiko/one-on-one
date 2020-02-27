const settings = require('../settings')
const http = require("./server.js");
http.listen(settings.serverPort, () => console.log(`listening on port ${settings.serverPort}`));
