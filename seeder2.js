import dotenv from "dotenv";
import SelectedLeague from "./Leagues_Fixtures/leagueModel.js";
import connnectDb from "./config/db.js";
import { apiStaticLeagues } from "./Leagues_Fixtures/apiStaticLeagues.js";

dotenv.config();

const MONGO_DB = process.env.MONGO_DB;
connnectDb(MONGO_DB);

const addSelectedLeagues = async () => {
  try {
    let count = 0;
    for (const league of apiStaticLeagues) {
      const newLeague = await SelectedLeague.create({
        id: league.id,
        name: league.name,
        image_path: league.logo,
      });

      console.log(`${++count}- ${newLeague.name} has been added!`);
    }
  } catch (error) {
    console.log("Error coccured while seeding leagues:", error);
  }
};

addSelectedLeagues();
