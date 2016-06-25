# rest-express
A rest api framework based on express.

# How to use?

``$ npm install rest-express -g``

```
let restExpress = require('rest-express');
restExpress.startServer(options)
  .then((err, server) => {
    if(err){
      return console.error(err);
    }
    let address = server.address();
    console.log('Server started', address);
  });
```
