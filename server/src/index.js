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

app.listen(process.env.PORT || 9002, () => {
  console.log("Backend started at port 9002");
});
