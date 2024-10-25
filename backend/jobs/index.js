const express = require('express')
const app = express()
const cors = require('cors'); // Import the 'cors' module
// const db = require('./models')

const port = 5000

const jobRouter = require('./routers/jobRouter')

app.use(cors()); // Use the 'cors' module
app.use("/jobs", jobRouter)

// db.sequelize.sync().then(() => {
//   app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
//   })
// })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})