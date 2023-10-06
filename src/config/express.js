const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
const frontAuth = require("../api/middlewares/front/auth");
const adminRoutes = require("../api/routes/v1/admin/index");
const frontRoutes = require("../api/routes/v1/front/index");
const aiFrontRoutes = require("../api/routes/v1/ai-front/index");
const discordRoutes = require("../api/routes/v1/discord/index");
const treasureboxRoutes = require("../api/routes/v1/treasurebox/index");
const gamificationRoutes = require("../api/routes/v1/gamification/index");
const webhookRoutes = require("../api/routes/v1/stripe/webHook.route");
const error = require("../api/middlewares/error");
const path = require("path");
const rateLimit = require("express-rate-limit");
const bearerToken = require("express-bearer-token");
const compression = require("compression");
const { port } = require("../config/vars");
/**
 * Express instance
 * @public
 */
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

// set socket
io.on("connection", async (socket) => {
  app.set("socket", io);
});

app.use("/v1/stripe", webhookRoutes);
// .on("userId-bid", {})
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bearerToken());

app.use(methodOverride());
const apiRequestLimiterAll = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 90000,
});

app.use(express.static(path.join(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, "../assets")));
app.use(express.static(path.join(__dirname, "../../admin/static/css")));

app.use("/v1/", apiRequestLimiterAll);

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// compress all responses
app.use(compression());

// authentication middleware to enforce authnetication and authorization
app.use(frontAuth.userValidation);

// authentication middleware to get token
app.use(frontAuth.authenticate);
// mount admin api v1 routes
app.use("/v1/admin", adminRoutes);

// mount front api v1 routes
app.use("/v1/front", frontRoutes);

// mount discord api v1 routes
app.use("/v1/discord", discordRoutes);

// mount treasurebox api v1 routes
app.use("/v1/treasurebox", treasureboxRoutes);

// mount gamification api v1 routes
app.use("/v1/gamification", gamificationRoutes);

// mount ai-front api v1 routes
app.use("/v1/ai-front", aiFrontRoutes);

// Admin Site Build Path
app.use("/admin/", express.static(path.join(__dirname, "../../admin")));
app.get("/admin/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../../admin", "index.html"));
});

// Front Site Build Path
app.use("/", express.static(path.join(__dirname, "../../build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

http.listen(port);

module.exports = app;
