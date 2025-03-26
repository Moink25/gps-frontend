import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue in React
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const socket = io("https://gps-data-rbrs.onrender.com"); // Your server

const customIcon = new L.Icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const App = () => {
    const [location, setLocation] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India

    useEffect(() => {
        socket.on("locationUpdate", (data) => {
            if (data.lat && data.lng) {
                setLocation({ lat: data.lat, lng: data.lng });
            }
        });

        return () => socket.off("locationUpdate");
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "20px", width: "100vw", height: "100vh" }}>
            <h1>Live GPS Tracker</h1>
            <MapContainer
                center={[location.lat, location.lng]}
                zoom={15}
                style={{ height: "80vh", width: "90%", margin: "auto", borderRadius: "10px" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[location.lat, location.lng]} icon={customIcon}>
                    <Popup>
                        <strong>Latitude:</strong> {location.lat} <br />
                        <strong>Longitude:</strong> {location.lng}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default App;
