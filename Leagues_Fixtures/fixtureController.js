import axios from "axios";
import League from "./leagueModel.js";
import AppInformation from "../AppInformation/appInformationModel.js";
import dotenv from "dotenv";
import SelectedLeague from "./leagueModel.js";
dotenv.config();
import { apiStaticLeagues } from "./apiStaticLeagues.js";
import UserLeague from "../SelectedLeagues/userLeagueModel.js";

// Updated function to get SportMonks API request config
export const getRapidRequest = async (country) => {
  const apiKey = "kKfW8AqjO0J2uNBRliLdvi1urmp0QMWybFhFfDhyi3FrxSy83U9o6UzOyZfd"; // Directly adding the API key
  return {
    method: "GET",
    // url: "https://api.sportmonks.com/v3/football/fixtures",
    url: "https://api.sportmonks.com/v3/my/leagues",
    params: {
      api_token: apiKey, // Adding the API key as the parameter
      country: country, // Passing the country as a parameter for filtering
    },
    headers: {
      authentication: apiKey,
    },
  };
};

export const getLeaguesRapid = async (req, res) => {
  try {
    const { country } = req.params;

    //  console.log('Step 1 - Extracted Country:', country);

    const rapidRequest = await getRapidRequest(country);

    //  console.log('Step 2 - Rapid Request Configuration:', rapidRequest);

    const response = await axios.request(rapidRequest);

    //  console.log('Step 3 - API Response:', response.data);

    const firstThreeItems = response.data?.data?.slice(0, 3);
    //  console.log('Step 4 - First Three Items:', firstThreeItems);
    res.status(200).json({
      status: true,
      data: response.data?.data,
    });

    //  console.log('Step 5 - Response Sent Successfully');
  } catch (error) {
    console.error("Error in getLeaguesRapid function:", error);

    res.status(500).json({
      status: false,
      error: error,
    });
    console.error(error);
  }
};

// export const getFixturesRapid = async (req, res) => {
//   const { date } = req.body; // Get the date from the request body

//   const apiToken = process.env.RUN_API_KEY; // Make sure your .env has this key
//   if (!apiToken) {
//     return res.status(500).json({ error: "API token is missing." });
//   }

//   // const url = `http://api.sportmonks.com/v3/football/leagues/date/${date}?api_token=${apiToken}`;
//   const url = `https://v3.football.api-sports.io/fixtures?date=${date}&api_key=${apiToken}`;

//   try {
//     // Make the API call using axios
//     const res = await axios.get(url);
//     console.log("my data ", res?.data);

//     // console.log(ress?.data?.data)

//     // Extract relevant data into a new object
//     // const extractedData = ress?.data?.data.map((item) => {
//     //   return {
//     //     name: item.name,
//     //     active: item.active,
//     //     short_code: item.short_code,
//     //     image_path: item.image_path,
//     //   };
//     // });

//     return res.status(200).json({
//       status: true,
//       data: extractedData,
//     }); // Only return the relevant data
//   } catch (error) {
//     // console.error("Error fetching data from SportMonks API:", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to fetch data from SportMonks API." });
//   }
// };

// const getFixturesRapid = async (req, res) => {
//   const { date } = req.body; // Get the date from the request body

//   const apiToken = process.env.RUN_API_KEY; // Make sure your .env has this key
//   if (!apiToken) {
//     return res.status(500).json({ error: "API token is missing." });
//   }

//   // Only include date in the URL, not the API key
//   const url = `https://v3.football.api-sports.io/fixtures?date=${date}`;

//   try {
//     // Make the API call using axios with API key in headers
//     const response = await axios.get(url, {
//       headers: {
//         "x-apisports-key": apiToken,
//       },
//     });

//     console.log("1", response?.data);

//     // You'll need to modify this part based on the actual API response structure

//     return res.status(200).json({
//       status: true,
//       data: response,
//     });
//   } catch (error) {
//     console.error("Error fetching fixtures data:", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to fetch data from API-Sports football API." });
//   }
// };

export const getFixturesRapid = async (req, res) => {
  const { date } = req.body; // Get the date from the request body

  const apiToken = process.env.RUN_API_KEY; // Make sure your .env has this key
  if (!apiToken) {
    return res.status(500).json({ error: "API token is missing." });
  }

  // Only include date in the URL, not the API key
  const url = `https://v3.football.api-sports.io/fixtures?date=${date}`;

  try {
    // Make the API call using axios with API key in headers
    const response = await axios.get(url, {
      headers: {
        "x-apisports-key": apiToken,
      },
    });

    // console.log("1", response?.data);

    // Only return the data part of the response, not the entire response object
    return res.status(200).json({
      status: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching fixtures data:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch data from API-Sports football API." });
  }
};

export const getLeagues = async (req, res) => {
  try {
    // Step 1: Check if leagues already exist
    const existingLeagues = await SelectedLeague.find({});

    if (existingLeagues.length > 0) {
      console.log("Leagues already found in DB");
      return res.status(200).json({
        success: true,
        message: "All leagues fetched successfully",
        data: existingLeagues,
      });
    }

    // Step 2: If not found in DB, fetch from API
    const API_TOKEN = process.env.API_KEY_SELECTED_LEAGUES;
    const API_URL = process.env.URL_SELECTED_LEAGUES;

    const { data } = await axios.get(API_URL, {
      headers: {
        "x-apisports-key": API_TOKEN,
      },
    });

    const leaguesFromAPI =
      data?.response?.map((item) => ({
        id: item.league.id,
        name: item.league.name,
        image_path: item.league.logo,
      })) || [];

    // Step 3: Filter only required leagues
    const filteredLeagues = leaguesFromAPI.filter((league) =>
      apiStaticLeagues.some((staticLeague) => staticLeague.id === league.id)
    );

    if (filteredLeagues.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No matching leagues found from API",
      });
    }

    // Step 4: Save to DB
    const savedLeagues = await SelectedLeague.insertMany(filteredLeagues);

    console.log("Leagues saved to DB:", savedLeagues);

    return res.status(200).json({
      success: true,
      message: "Leagues fetched from API and saved successfully",
      data: savedLeagues,
    });
  } catch (error) {
    console.error("Error in getLeagues:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// export const getLeagues = async (req, res) => {
//   try {
//     const API_TOKEN = process.env.API_KEY_SELECTED_LEAGUES;
//     const API_URL_getLeagues = process.env.URL_SELECTED_LEAGUES; // Correct API URL

//     const response = await axios.get(API_URL_getLeagues, {
//       headers: {
//         "x-apisports-key": API_TOKEN, // API key should be passed in headers
//       },
//     });

//     const leaguesArray = response?.data?.response;
//     const rawLeagues = leaguesArray.map((lgObj) => lgObj.league);

//     console.log("rawLeagues", rawLeagues);

//     const changeName = rawLeagues.map((league) => ({
//       id: league.id,
//       name: league.name,
//       image_path: league.logo,
//     }));

//     const mapleagues = changeName.filter((league) =>
//       apiStaticLeagues.some((staticLeague) => staticLeague.id === league.id)
//     );

//     // Check if leagues already exist
//     const existingLeagues = await SelectedLeague.find();

//     console.log("existingLeagues---", existingLeagues);

//     if (existingLeagues.length > 0) {
//       return res.status(200).json({
//         status: true,
//         message: "All required leagues are found in database",
//         data: existingLeagues,
//       });
//     }

//     // Insert only if no data exists
//     const leagues = await SelectedLeague.insertMany(mapleagues);

//     console.log("Leagues in database %%%", leagues);

//     res.status(200).json({
//       status: true,
//       message: "All selected Leagues saved successfully",
//       data: leagues,
//     });
//   } catch (error) {
//     console.error("error", error, error?.message);
//     res.status(500).json({
//       status: false,
//       error: error.message || error,
//     });
//   }
// };

export const setLeagues = async (req, res) => {
  try {
    const { league_id, name, logo, code } = req.body;

    // console.log("Step 1: Received request body:", req.body); // Log the request body

    if (name && logo) {
      // console.log("Step 2: Name and Logo found, proceeding with league creation.");

      const createLeague = new League({
        league_id,
        name: name,
        logo: logo,
        code: code,
      });

      // console.log("Step 3: League object created:", createLeague); // Log the created league object

      const saveLeague = await createLeague.save();

      // console.log("Step 4: League saved successfully:", saveLeague); // Log the saved league

      res.status(200).json({
        status: true,
        data: saveLeague,
      });

      // console.log("Step 5: Response sent successfully."); // Confirm response sent
    } else {
      // console.log("Step 6: Required fields missing, sending error response."); // Log missing field error

      res.status(500).json({
        error: "Required name & logo not found...",
      });
    }
  } catch (err) {
    // console.error("Step 7: Error occurred while saving league:", err); // Log the error

    res.status(500).json({
      status: false,
      error: err,
    });
  }
};

// Delete a league from DB
export const deleteLeague = async (req, res) => {
  const { id } = req.params;
  try {
    const del = await League.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      deleted: del,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err,
    });
  }
};

export const getAllFixturesForDate = async (req, res) => {
  const { _id: user } = req.user;
  const { fixtureDate } = req.query;
  if (!fixtureDate) {
    return res.status(400).json({
      success: false,
      message: "Please provide fixture date to continue!",
    });
  }
  const apiToken = process.env.RUN_API_KEY;
  if (!apiToken) {
    return res.status(500).json({ error: "API token is missing." });
  }
  try {
    const url = `https://v3.football.api-sports.io/fixtures?date=${fixtureDate}`;
    const response = await axios.get(url, {
      headers: {
        "x-apisports-key": apiToken,
      },
    });

    const allFixtures = response.data?.response ?? [];
    if (!allFixtures || !allFixtures.length) {
      return res.status(200).json({
        success: true,
        message: "Fixtures were not found",
        // fixtures: [],
      });
    }

    // TODO: Get the select league ids
    const userLeagueids = await UserLeague.find({ user });
    console.log("userLeagueids-----kkkk", userLeagueids);
    const leagueids = userLeagueids.map((lg) => lg.league);

    const selectedLeagObjs = await SelectedLeague.find({
      _id: { $in: leagueids },
    });

    const finalSelectedIds = selectedLeagObjs.map((lg) => lg.id);

    const fixture = allFixtures.filter((fixt) =>
      finalSelectedIds.includes(fixt.league.id)
    );
    return res.status(200).json({
      success: true,
      message: "fixture  found !",
      fixture,
    });
  } catch (error) {
    console.log("Error getting fixture:", error);
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal Server Error!",
    });
  }
};

export const getAllFixturesByDateForApp = async (req, res) => {
  const { fixtureDate } = req.query;
  if (!fixtureDate) {
    return res.status(400).json({
      success: false,
      message: "Please provide fixture date to continue!",
    });
  }
  const apiToken = process.env.RUN_API_KEY;
  if (!apiToken) {
    return res.status(500).json({ error: "API key is missing." });
  }
  try {
    const url = `https://v3.football.api-sports.io/fixtures?date=${fixtureDate}`;
    const response = await axios.get(url, {
      headers: {
        "x-apisports-key": apiToken,
      },
    });

    const allFixtures = response.data?.response ?? [];
    if (!allFixtures || !allFixtures.length) {
      return res.status(200).json({
        success: true,
        message: "No Fixtures were found",
        // fixtures: [],
      });
    }

    // TODO: Get the select league ids
    const userLeagueids = await UserLeague.find();
    console.log("userLeagueids-qqqqqqqqqq", userLeagueids);
    const leagueids = userLeagueids.map((lg) => lg.league);

    const selectedLeagObjs = await SelectedLeague.find({
      _id: { $in: leagueids },
    });

    const finalSelectedIds = selectedLeagObjs.map((lg) => lg.id);

    const fixture = allFixtures.filter((fixt) =>
      finalSelectedIds.includes(fixt.league.id)
    );
    return res.status(200).json({
      success: true,
      message: "fixture found !",
      fixture,
    });
  } catch (error) {
    console.log("Error getting fixture:", error);
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal Server Error!",
    });
  }
};
