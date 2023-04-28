import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';

const deployment_url = 'https://sesl-1-challenge-3.vercel.app';
// import fetch from
config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));


//var ObjectId = require("mongodb").ObjectId;

const uuid = require("uuid");

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
    res.set('Access-Control-Allow-Origin', deployment_url);
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
    res.set('Access-Control-Allow-Origin', deployment_url);
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

app.get("/getLeaderboard", (_req, res) => {
  try {
    res.set('Access-Control-Allow-Origin', deployment_url);
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
    res.set('Access-Control-Allow-Origin', deployment_url);
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

app.get('/', (_req, res) => {
    res.set('Access-Control-Allow-Origin', deployment_url);
    res.sendFile(__dirname + '../client/index.html');
});

const PORT = process.env.PORT || 9002;
mongoose.connect(process.env.MONGO_DB!).then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}).catch(err => {
    console.log(err);
});