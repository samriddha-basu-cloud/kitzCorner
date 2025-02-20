import Navbar from "../components/Navbar";
import Model from "../components/Model";
import { Gallery } from "../components/Gallery";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Model />
      <Gallery />
    </div>
  );
}