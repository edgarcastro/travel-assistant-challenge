import type { TravelItem } from "shared";

export default function App() {
  const placeholder: TravelItem = {
    id: "1",
    destination: "Tokyo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div>
      <h1>Travel Wishlist</h1>
      <p>Destination: {placeholder.destination}</p>
    </div>
  );
}
