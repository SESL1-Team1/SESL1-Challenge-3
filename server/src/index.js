const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// import fetch from
const dotenv = require("dotenv");
dotenv.config();
const { MONGO_DB } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
var ObjectId = require("mongodb").ObjectId;
main().catch((err) => console.log(err));

const uuid = require("uuid");
async function main() {
  await mongoose.connect(MONGO_DB);
}
const setWordSchema = new mongoose.Schema({
  uuid: String,
  word: String,
});
const SetWord = mongoose.model("setword", setWordSchema);

const leaderboardSchema = new mongoose.Schema({
  name: String,
  score: Number,
});
const LeaderBoard = mongoose.model("leaderboard", leaderboardSchema);

// const player1 = new LeaderBoard({
//   name: "saumya",
//   score: 9,
// });
// player1.save();

// {
//   "word":"sample word"
// }
app.post("/setWord", (req, res) => {
  try {
    // console.info(req.body);
    const { word } = req.body;
    if (word !== "") {
      console.info("set word for ", word);
      const uuidForWord = uuid.v1();
      const settingWord = new SetWord({
        uuid: uuidForWord,
        word: word,
      });
      settingWord.save();
      res.status(200).send({ message: uuidForWord });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "server error for setting word" });
  }
});

// {
//   "uuidForWord":"sample uuid"
// }
app.post("/getWord", (req, res) => {
  try {
    // console.info(req.body);
    const { uuidForWord } = req.body;
    console.info("get word for ", uuidForWord);
    SetWord.findOne({ uuid: uuidForWord }).then(async (entry) => {
      if (entry) {
        res.status(200).send({ message: entry.word });
      } else {
        res.status(250).send({ message: "No word for this URL" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "server error for getting word" });
  }
});

app.get("/getLeaderboard", (req, res) => {
  try {
    console.info("get leaderboard ");
    LeaderBoard.find({}).then(async (entries) => {
      res.status(200).send({ message: entries });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "server error for getting leaderboard" });
  }
});

// {
//   "name":"sample name",
//   "score":"10"
// }
app.post("/setLeaderboard", (req, res) => {
  try {
    const { name, score } = req.body;
    console.info("set leaderboard name for", name, score);
    const player = new LeaderBoard({
      name: name,
      score: score,
    });
    player.save();
    res.status(200).send({ message: "added to leaderboard" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "server error for adding to leaderboard" });
  }
});

app.listen(process.env.PORT || 9002, () => {
  console.log("Backend started at port 9002");
});
