import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix pour les icônes manquantes
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function CarteEntrepots() {
  const entrepots = [
    { id: 1, nom: "Entrepôt Fès", lat: 34.03, lng: -5.00 },
    { id: 2, nom: "Entrepôt Casa", lat: 33.58, lng: -7.62 },
    { id: 3, nom: "Entrepôt Rabat", lat: 34.02, lng: -6.83 },
  ];

  return (
    <div className="h-[500px] rounded-xl overflow-hidden">
      <MapContainer
        center={[33.9, -6.3]}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {entrepots.map((e) => (
          <Marker key={e.id} position={[e.lat, e.lng]}>
            <Popup>{e.nom}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
