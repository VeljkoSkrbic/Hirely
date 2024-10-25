const express = require('express')
const app = express()
const cors = require('cors'); // Import the 'cors' module

const port = 5001

const userRouter = require('./routers/userRouter')

app.use(cors()); // Use the 'cors' module
app.use("/users", userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})