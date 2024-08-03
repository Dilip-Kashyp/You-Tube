const app = require("./src/app.js");
const { connectionDB } = require("./src/db/connectDB.js");
require("dotenv").config();

const port = process.env.PORT || 5400;
console.log(`Connecting to Mongooes.....`);
connectionDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("DB connection error ", err);
  });
