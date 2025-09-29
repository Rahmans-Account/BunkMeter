const app = require("./app");
const attendamceRouter = require("./routes/attendanceRouter");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/", attendamceRouter);
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
