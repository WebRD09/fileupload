const express = require("express");
const axios = require("axios");
const fs = require("fs");
const util = require("util");
const stream = require("stream");
const pipeline = util.promisify(stream.pipeline);
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

// Allows to serve static file
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/getfile", async (req, res) => {
  const url = req.query.url;
  const filename = uuidv4();

  try {
    const response = await axios.get(url, {
      responseType: "stream",
    });
    await pipeline(
      response.data,
      fs.createWriteStream(`./public/image/${filename}.jpg`)
    );
    res.send({
      oldUrl: url,
      newUrl: `localhost:3000/image/${filename}.jpg`,
      fileLocation: `/image/${filename}.jpg`,
    });
  } catch (error) {
    res.status(404).send("File not found");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
