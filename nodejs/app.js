const express = require('express');

const app = express();
const port = 9999;

app.use(express.static('./public'));

app.use('/api', require('./api.js'));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});