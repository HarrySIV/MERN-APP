const http = require('http');
const express = require('express');
const port = process.env.PORT || 5000;
const app = express();

app.use(express.static('public'));

app.get('/express_backend', (req, res, next) => {
  res.sendFile({ express: `Express Backend is connected to React` });
})

app.listen(port, function() {
  console.log(`Server is running on port ${port}.`);
})