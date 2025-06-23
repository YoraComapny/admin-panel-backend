import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import connectDb from "./config/db.js";
import router from "./user/userRoute.js";
import profileRoute from "./user/userProfileUpload.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import newsRoute from "./news/newUpload.js";
import newsUpdateRoute from "./news/newsupdate.js";
import newsRouter from "./news/newsRouter.js";
import appInformationRouter from "./AppInformation/appInformationRoute.js";
import notificationRouter from "./notification/notificationRouter.js";
// import androidads from "./androidAds/AdRoutes.js";
import androidads from "./androidAds/androidAdRoutes.js";
import notificationSettingsRoutes from "./NotificationSetting/notificationSettingsRoutes.js";
//import iosSettingRouter from "./iosSettings/iosSettingsRoutes.js";
import matchRouter from "./match/matchRouter.js";
import administratorSettings from "./AdminSettings/adminRoutes.js";
import fixtureRouter from "./Leagues_Fixtures/fixtureRoutes.js";
import iosSettingRouter from "./iosSettings/iosSettingsRoutes.js";
import androidSettingRouter from "./android/androidSettingRoutes.js";
import socialLinks from "./socialLinks/socialLinksRoutes.js";
import Iosads from "./iosAds/iosAdRoutes.js";
import typesAdd from "./types-add/addRoutes.js";
import typeSportsRouter from "./types-sports/sportsRoute.js";
import typesLeaguesRouter from "./typesLeague/typesLeagueRoute.js";
import selectedLeaguerouter from "./SelectedLeagues/selectedLeagueRoute.js";
import logger from "morgan";
import statusRouter from "./status/status.routes.js";
import StatusViewRouter from "./status_update/status_update.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

app.use(cors());

dotenv.config();
app.use(logger("dev"));

const MONGO_DB = process.env.MONGO_DB;
connectDb(MONGO_DB);

app.use("/api", router); //Done
app.use("/api/manage-app/app-information", appInformationRouter); //Done
app.use("/api/notifications", notificationRouter); //Done
app.use("/api/manage-app/social-links", socialLinks); //Done

// ====================Android api====================
app.use("/api/manage-app/ads", androidads); //Done
// ====================Ios api====================
app.use("/api/manage-app/ios-ads", Iosads); //Done

app.use("/api/manage-app/android", notificationSettingsRoutes); //Done

app.use("/api/ios", iosSettingRouter); //Done

app.use("/api/android", androidSettingRouter); //Done

app.use("/api/admin", administratorSettings); //Done

app.use("/api/fixture", fixtureRouter); //Done
app.use("/api/types-add", typesAdd); //Done
app.use("/api/types-sports", typeSportsRouter); //Done
app.use("/api/types-leagues", typesLeaguesRouter); //Done

app.use("/api/selected-leagues", selectedLeaguerouter); //Done

app.use(express.urlencoded({ extended: true, limit: "500mb" }));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/newsuploads", express.static(path.join(__dirname, "/newsuploads")));
app.use(
  "/appInformationupload",
  express.static(path.join(__dirname, "/appInformationupload"))
);
app.use(
  "/androidSettingUpload",
  express.static(path.join(__dirname, "/androidSettingUpload"))
);
// app.use(
//   "/iosSettingUpload",
//   express.static(path.join(__dirname, "/iosSettingUpload"))
// );

// server.js
app.use('/assets', express.static('assets'));


app.use("/api", profileRoute);
app.use("/api", newsRoute);
app.use("/api", newsUpdateRoute);
app.use("/api", newsRouter);
app.use("/api/live", matchRouter);
app.use("/api", statusRouter);
app.use("/api", StatusViewRouter);

// Define routes for static pages

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "lander.html"));
});

app.get("/app-ads.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "app-ads.txt"));
});

app.get("/terms", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "terms.html"));
});

// Define routes for privacy policy page
app.get("/privacy", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "privacy.html"));
});

// Define routes for contact-us page
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "contact-us.html"));
});

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "./client/dist")));

  app.get("/admin/*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "./client/dist/index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

const PORT = process.env.PORT;
app.listen(PORT, (req, res) => {
  console.log(`\n http://localhost:${PORT}`.yellow.bold.underline);
});
