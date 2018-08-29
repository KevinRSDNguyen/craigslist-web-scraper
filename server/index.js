const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use(cors());

app.use(morgan("tiny"));

function getResults(body) {
  const $ = cheerio.load(body);
  const rows = $("li.result-row");
  const results = [];

  rows.each((index, element) => {
    const result = $(element);
    const title = result.find(".result-title").text();
    const price = $(result.find(".result-price").get(0)).text(); //Since there are 2 spans with price
    // data-ids="1:00r0r_gd8xnL1aVMx,1:00606_itkxGQR4XpX,1:01313_83rswFxnnKQ"
    const imageData = result.find("a.result-image").attr("data-ids");
    let images = [];
    if (imageData) {
      const parts = imageData.split(",");
      images = parts.map(id => {
        return `https://images.craigslist.org/${id.split(":")[1]}_300x300.jpg`;
      });
    }

    //subarea or neighborhood
    let hood = result.find(".result-hood").text();

    if (hood) {
      //Regex for anything within parenthesis.
      hood = hood.match(/\((.*)\)/)[1];
      //.trim().replace("(", "").replace(")", "");
    }

    let url = result.find(".result-title.hdrlnk").attr("href");

    results.push({
      title,
      price,
      images,
      hood,
      url
    });
  });

  return results;
}

// https://sfbay.craigslist.org/search/sss?query=synth&sort=rel
app.get("/search/:location/:search_term", (req, res) => {
  const { location, search_term } = req.params;

  const url = `https://${location}.craigslist.org/search/sss?sort=rel&query=${search_term}`;
  axios
    .get(url)
    .then(({ data }) => data)
    .then(body => {
      const results = getResults(body);
      res.json({
        results
      });
    })
    .catch(e => {
      res
        .status(422)
        .send(`Location of ${location} could not be found on Craigslist`);
    });
});

//404 for if page not found
app.use((request, response, next) => {
  const error = new Error("not found");
  response.status(404);
  next(error);
});

app.use((error, request, response, next) => {
  response.status(response.statusCode || 500);
  response.json({
    message: error.message
  });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
