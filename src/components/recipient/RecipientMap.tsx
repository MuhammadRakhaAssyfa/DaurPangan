import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProviderTypeBadge } from "@/components/ProviderTypeBadge";
import {
  JAKARTA_CENTER,
  providerTypeMap,
  type FoodListing,
  type ProviderType,
} from "@/lib/mock-data";
import { toast } from "sonner";

const formatRupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

/** Marker fill color per provider type. Mirrors the design tokens used on cards. */
const markerColor: Record<ProviderType, string> = {
  restoran: "#2C5F2D",
  hotel: "#1D4ED8",
  toko: "#F4A261",
  rumah: "#6B7280",
};

/**
 * Build a colored circular DivIcon. Using a DivIcon avoids shipping any
 * external image asset and keeps the marker color tied to the provider type.
 */
const buildIcon = (type: ProviderType) =>
  L.divIcon({
    className: "daurpangan-marker",
    html: `<span style="
      display:flex;align-items:center;justify-content:center;
      width:30px;height:30px;border-radius:9999px;
      background:${markerColor[type]};
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      color:white;font-size:14px;line-height:1;
    ">${providerTypeMap[type].emoji}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

const userIcon = L.divIcon({
  className: "daurpangan-user-marker",
  html: `<span style="
    display:block;width:18px;height:18px;border-radius:9999px;
    background:hsl(224 76% 48%);
    border:3px solid white;
    box-shadow:0 0 0 4px hsla(224, 76%, 48%, 0.25);
  "></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/** Imperative helper to recenter when user position changes. */
const Recenter = ({ pos }: { pos: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo(pos, 15, { duration: 0.8 });
  }, [pos, map]);
  return null;
};

interface Props {
  listings: FoodListing[];
  onListingClick?: (id: string) => void;
}

export const RecipientMap = ({ listings, onListingClick }: Props) => {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const points = useMemo(
    () => listings.filter((l) => l.lat != null && l.lng != null),
    [listings],
  );

  const handleLocate = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Browser Anda tidak mendukung geolokasi.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
        toast.success("Lokasi Anda ditemukan.");
      },
      (err) => {
        setLocating(false);
        toast.error(
          err.code === err.PERMISSION_DENIED
            ? "Izin lokasi ditolak."
            : "Tidak bisa mendapatkan lokasi Anda.",
        );
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl border border-border shadow-soft h-72 md:h-96"
    >
      <MapContainer
        center={[JAKARTA_CENTER.lat, JAKARTA_CENTER.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {points.map((l) => (
          <Marker
            key={l.id}
            position={[l.lat as number, l.lng as number]}
            icon={buildIcon(l.providerType)}
          >
            <Popup>
              <div className="min-w-[200px] space-y-1.5">
                <p className="font-semibold text-sm leading-tight">{l.name}</p>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground">{l.provider}</span>
                </div>
                <ProviderTypeBadge type={l.providerType} />
                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-muted-foreground">{l.distanceKm} km</span>
                  <span className="font-semibold">
                    {l.isFree ? "GRATIS" : formatRupiah(l.price ?? 0)}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="hero"
                  className="w-full mt-1 h-8 text-xs"
                  onClick={() => onListingClick?.(l.id)}
                >
                  Lihat Detail →
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>Lokasi Anda</Popup>
          </Marker>
        )}

        <Recenter pos={userPos} />
      </MapContainer>

      {/* Locate button */}
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="absolute top-3 right-3 z-[400] shadow-card gap-1.5"
        onClick={handleLocate}
        disabled={locating}
      >
        <Locate className="h-3.5 w-3.5" />
        {locating ? "Mencari..." : "Lokasi Saya"}
      </Button>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[400] rounded-xl bg-background/95 backdrop-blur px-3 py-2 shadow-card text-[11px] font-medium space-y-1">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: markerColor.restoran }} />
          🍽️ Restoran
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: markerColor.hotel }} />
          🏨 Hotel & Katering
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: markerColor.toko }} />
          🛒 Toko & Pasar
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: markerColor.rumah }} />
          🏠 Rumah Tangga
        </div>
      </div>
    </div>
  );
};
