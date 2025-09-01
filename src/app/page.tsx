import AllSongs from "@/components/AllSongs";
import Navbar from "@/components/Navbar";
import FrontendLayout from "../../layouts/FrontendLayout";


export default function Home() {
  return (
   <FrontendLayout>
     <div className="min-h-screen">
    <Navbar/>
      <AllSongs/>
    </div>
   </FrontendLayout>
  );
}
