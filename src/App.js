// import * as React from "react";
import Rating from "@mui/material/Rating";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useMemo, useState } from "react";
// import Map, { Marker, Popup } from "react-map-gl";
import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl";
import { format } from "timeago.js";
import "./App.css";
// import ControlPanel from './control-panel';

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY3J6eXNuIiwiYSI6ImNrdXp5dGJhODB1MWQycXBibHc2MWZjY3gifQ.xdObvTaQnBJI1Q4qoqxddg"; // Set your mapbox token here

function App() {
  const [CITIES, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(true);
  const [rating, setRating] = useState(2);

  const [popupInfo, setPopupInfo] = useState(null);

  const [viewState, setViewState] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (error) {
        console.log("DEBUG_ERROR", error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (city) => {
    console.log(city);
    {city._id && setCurrentPlaceId(city._id)}
    setPopupInfo(city)
  }

  const pins = useMemo(
    () =>
      CITIES.map(
        (city, index) => (
          (
            <Marker
              key={`marker-${index}`}
              longitude={city.long}
              latitude={city.lat}
              anchor="left"
              onClick={(e) => 
                handleMarkerClick(city)
              }
            ></Marker>
          )
        )
      ),
    [CITIES]
  );

  

  return (
    <>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {pins}

        {popupInfo && popupInfo._id === currentPlaceId && (
          <Popup
          longitude={Number(popupInfo.long)}
          latitude={Number(popupInfo.lat)}
          anchor="left"
          closeButton={true}
          closeOnClick={false}
          onClose={() => setCurrentPlaceId(null)}
          >
            console.log(popupInfo);
            <InfoCard setValue={setRating} format={format} pin={popupInfo} />
          </Popup>
        )}
      </Map>
    </>
  );
}

function InfoCard({ setRating, format, pin }) {
  return (
    <div className="card">
      <label>Place</label>
      <h4 className="place">{pin.title}</h4>
      <label>Review</label>
      <p className="desc">{pin.description}</p>
      <label>Rating</label>
      <div className="stars">
        <Rating
          name="simple-controlled"
          value={pin.rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
      </div>
      <label>Information</label>
      <span className="username">
        Created by <b> {pin.username} </b>{" "}
      </span>

      <span className="date"> {format(pin.createdAt)}</span>
    </div>
  );
}
export default App;
