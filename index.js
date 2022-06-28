const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

require("./firebase");
require("./helpers/scheduleDbTasks");

app.use(cors());
app.use(express.json());

const usersRoute = require("./routes/users");
const settingsRoute = require("./routes/settings");

app.use("/users", usersRoute);
app.use("/settings", settingsRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello!",
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "No such endpoint",
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
