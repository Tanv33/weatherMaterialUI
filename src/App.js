import "./App.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import sunny from "./videos/sunny.mp4";
import cloudy from "./videos/cloudy.mp4";
import strom from "./videos/strom.mp4";
import lightning from "./videos/lightning.mp4";
import rain from "./videos/rain.mp4";
import mist from "./videos/v1.mp4";
// Material UI Imports
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
// React Bootstrap
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [weather, setweather] = useState(null);
  const cityName = useRef(null);
  const [location, setLocation] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [videoBg, setVideoBg] = useState(null);
  useEffect(() => {
    let name = "";
    if (cityName.current.value) {
      name = `q=${cityName.current.value}`;
    } else if (location === null) {
      name = `q=london`;
    } else if (location) {
      if (!location) {
      } else if (location === "fail") {
        name = "q=new york";
      } else if (location && location.latitude) {
        name = `lat=${location.latitude}&lon=${location.longitude}`;
      }
    }
    if (name) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?${name}&appid=363a0329911c1b074081245aae1023c3&units=metric`
        )
        .then((res) => {
          const newWeather = res.data;
          setweather(newWeather);
          if (newWeather.weather[0].main === "Clouds") {
            setVideoBg(cloudy);
          } else if (newWeather.weather[0].main === "Rain") {
            setVideoBg(rain);
          } else if (newWeather.weather[0].main === "Strom") {
            setVideoBg(strom);
          } else if (
            newWeather.weather[0].main ===
            ("Lightning" || newWeather.weather[0].main === "Thunder")
          ) {
            setVideoBg(lightning);
          } else if (newWeather.weather[0].main === "Mist") {
            setVideoBg(mist);
          } else {
            setVideoBg(sunny);
          }
        });
    }
  }, [location, submit]);

  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
    getLocation();
  }, []);

  return (
    <>
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar sx={{ backgroundColor: "#0D47A1" }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Weather-App
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <video src={videoBg} muted loop autoPlay></video>
        <Container maxWidth="lg">
          <h1 style={{ marginTop: "30px", marginBottom: "14px" }}>City Name</h1>
          <Form.Control ref={cityName} size="lg" />
          <Button
            variant="contained"
            onClick={() => {
              setSubmit(!submit);
            }}
            sx={{ backgroundColor: "#0D47A1", color: "white" }}
            size="large"
            style={{ margin: "10px" }}
          >
            Submit
          </Button>
          {weather !== null ? (
            <>
              <h1 style={{ margin: "14px" }}>{weather.name} Weather</h1>
              <h2 style={{ margin: "14px" }}>
                Nature: {weather.weather[0].main} (Description:{" "}
                {weather.weather[0].description})
              </h2>
              <h2 style={{ margin: "14px" }}>
                Temperature: {weather.main.temp}
              </h2>
              <h2 style={{ margin: "14px" }}>
                Wind Speed: {weather.wind.speed}
              </h2>
              <h2 style={{ margin: "14px" }}>
                Humidity: {weather.main.humidity}
              </h2>
              <h2 style={{ margin: "14px" }}>Country: {weather.sys.country}</h2>
            </>
          ) : (
            <h1>Loading...</h1>
          )}{" "}
        </Container>
      </div>
    </>
  );
}
export default App;
