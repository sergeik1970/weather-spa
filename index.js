const express = require("express");
const port = 3000;
const app = express();
const https = require("https");

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/static"))

app.set("view engine", "ejs");

const weather_api_key = process.env.WEATHER_API_KEY;

app.get("/", (req, res) => {

    const sendData = { city: "my city", iconUrl: "my url", description: "my descr", temp: "my temp", humidity: "my humidity", speed: "my speed", visibility: "my visibility" };

    res.render("index", { sendData: false, error: "" });
})

app.post("/", (req, res) => {

    let city = req.body.city;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weather_api_key}&units=metric&lang=ru`;

    console.log(url)

    https.get(url, function (response) {
        console.log(response.statusCode, response.statusMessage);
        if (response.statusCode === 200) {
            response.on("data", function (data) {
                const weatherData = JSON.parse(data);
                console.log(weatherData)

                const city = weatherData.name;
                const { temp, humidity } = weatherData.main;
                const { description, icon } = weatherData.weather[0];
                const iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png";
                const { speed } = weatherData.wind;
                const visibility = weatherData.visibility;
                const sendData = {
                    city: city,
                    iconUrl: iconUrl,
                    description: description,
                    temp: Math.round(temp),
                    humidity: humidity,
                    speed: Math.round(speed),
                    visibility: visibility
                };

                res.render("index", {sendData: sendData, error: "" });
            })
        }

        else {
            console.log("Город не найден")
            const errorMsg = "Город не найден"
            res.render("index", { sendData: false, error: errorMsg });
        }
    })
})

app.listen(port, () => {
    console.log("Server is running on port http://localhost:" + port);
})