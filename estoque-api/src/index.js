const express = require("express");
const cors = require("cors");

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(cors());
  }

  routes() {
    const apiRoutes = require("./routes/apiRoutes");
    this.express.use("/api", apiRoutes);
  }
}

module.exports = new AppController().express;