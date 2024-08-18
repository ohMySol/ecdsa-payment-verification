const express = require('express');
const signRoutes = require('./routes/sign')

const app = express();
const port = 3030;

app.use('/sign', signRoutes)

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
