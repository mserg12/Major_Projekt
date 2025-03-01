import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Import Leaflet components
import "./map.scss"; // Import SCSS file for styling
import "leaflet/dist/leaflet.css"; // Import default Leaflet styles

function Map({ items }) {
  return (
    <MapContainer
      center={
        items.length === 1
          ? [items[0].latitude, items[0].longitude] // Center on the only item's location
          : [52.4797, -1.90269] // Default coordinates (Birmingham, UK) if multiple or no locations
      }
      zoom={7} 
      scrollWheelZoom={false} // Disable zooming with the mouse scroll wheel
      className="map" // Apply CSS class
    >
      {/* OpenStreetMap Tile Layer for rendering the map */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render markers for each location */}
      {items.map((item) => (
        <Marker key={item.id} position={[item.latitude, item.longitude]}>
          <Popup>{item.city || "Unknown City"}</Popup> {/* Show city name in a popup */}
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map; 
