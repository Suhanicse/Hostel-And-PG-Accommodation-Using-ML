const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const axios = require("axios");

const MONGO_URL = "mongodb://127.0.0.1:27017/pgAccomadation";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
.then(() => console.log("connected to DB"))
.catch((err) => console.log(err));

const initDB = async () => {

  await Listing.deleteMany({});

  for (let obj of initData.data) {

    try {
      const geoData = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${obj.location},${obj.country}`,
        {
          headers: { "User-Agent": "wanderlust-app" }
        }
      );

      if (geoData.data.length > 0) {

        let lat = parseFloat(geoData.data[0].lat);
        let lon = parseFloat(geoData.data[0].lon);

        obj.geometry = {
          type: "Point",
          coordinates: [lon, lat],
        };

      } else {

        // default coordinates if API fails
        obj.geometry = {
          type: "Point",
          coordinates: [0, 0],
        };

      }

    } catch (err) {

      obj.geometry = {
        type: "Point",
        coordinates: [0, 0],
      };

      console.log("Geocoding failed for:", obj.location);
    }

    obj.owner = "69b3a299930725dfb9d994e8";
  }

  await Listing.insertMany(initData.data);

  console.log("Data initialized successfully");
};

initDB();