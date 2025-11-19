import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Correção dos ícones do Leaflet no React ---
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// ------------------------------------------------

interface MapProps {
    initialPosition: [number, number];
    markers?: { lat: number; lng: number; title: string; description?: string }[];
    onPositionSelected?: (lat: number, lng: number) => void; // Para quando o usuário clicar no mapa
    interactive?: boolean; // Se pode clicar para marcar
}

// Componente auxiliar para detectar cliques no mapa
const LocationMarker = ({ onSelect }: { onSelect: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

export const MapComponent = ({ initialPosition, markers = [], onPositionSelected, interactive = false }: MapProps) => {
    return (
        <MapContainer center={initialPosition} zoom={13} scrollWheelZoom={true} className="w-full h-full rounded-lg z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Marcadores fixos (ex: onde o pet sumiu) */}
            {markers.map((m, idx) => (
                <Marker key={idx} position={[m.lat, m.lng]}>
                    <Popup>
                        <strong>{m.title}</strong> <br /> {m.description}
                    </Popup>
                </Marker>
            ))}

            {/* Se for interativo, detecta cliques */}
            {interactive && onPositionSelected && (
                <LocationMarker onSelect={onPositionSelected} />
            )}
        </MapContainer>
    );
};