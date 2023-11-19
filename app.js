require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  // console.log("what is this: ", req.query);
  spotifyApi
    .searchArtists(req.query.artistName, { limit: 5 }) // <----- artistName is name="artistName" in our search form
    .then((data) => {
      // console.log(
      //   "The received data from the API: ",
      //   data.body.artists.items[0] // shows the first item in the array we are looking for - if we want to find out about the structure of the data, first console.log all the data or res.send the data.body as a json file and then look at the structure in the browser
      // );
      res.render("artist-search-results", {
        artists: data.body.artists.items,
      });
      // res.send(data.body.artists.items[0]);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//ROUTE 3: THE DETAILS OF A SPECIFIC ARTIST BASED ON THE UNIQUE ID (WHICH GETS CAPTURED FROM THE URL)
//localhost:3000/albums/123eER56-8Ig009lhY

//                artistId => this is placeholder, can be any word,
//                  |      just make sure you use the same word in "req.params.______"
app.get("/albums/:artistId", (req, res) => {
  // console.log("Id is: ", req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      // console.log("The received albums from the API: ", data.body.items);
      res.render("albums", { albums: data.body.items });
      // res.send(data.body.items[1]);
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

// ROUTE 4: THE DETAILS OF A SPECIFIC TRACK BASED ON THE UNIQUE ID (WHICH GETS CAPTURED FROM THE URL)
// http://localhost:3000/tracks/aaarr554-oeRtRpu7814r

//  trackId => this is placeholder, can be any word,
//  just make sure you use the same word in "req.params.______"

app.get("/tracks/:trackId", (req, res) => {
  // console.log("Id is: ", req.params.trackId); // wordt uit de url gehaald van de weergegeven pagina, zie albums.hbs
  spotifyApi
    .getAlbumTracks(req.params.trackId)
    .then((data) => {
      // console.log("The received albums from the API: ", data.body.items);
      res.render("tracks", { tracks: data.body.items });
      // res.send(data.body.items[1]);
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(3001, () =>
  console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊")
);

// ALTERNATIVE CAPTURING ID FROM URL USING REQ.QUERY:
// www.some-route/blah?someKey=123456 => this would still be req.query.someKey instead of req.params
