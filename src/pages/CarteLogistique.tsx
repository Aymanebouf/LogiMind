import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 👉 Importer les icônes avec import (sinon erreur "require is not defined")
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix des icônes Leaflet pour affichage
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function CarteLogistique() {
  const entrepots = [
    { id: 1, nom: "Entrepôt Fès", lat: 34.03, lng: -5.00 },
    { id: 2, nom: "Entrepôt Casa", lat: 33.58, lng: -7.62 },
    { id: 3, nom: "Entrepôt Rabat", lat: 34.02, lng: -6.83 },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Carte logistique</h1>
        <p className="text-muted-foreground mt-2">
          Visualisez vos flux logistiques et l'état de vos entrepôts en temps réel
        </p>
      </div>

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
    </div>
  );
}
