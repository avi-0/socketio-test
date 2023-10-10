import { Route, Routes } from "react-router-dom";
import NewRoom from "./pages/NewRoom";
import NewRoomForm from "./pages/NewRoomForm";
import Room from "./pages/Room";

export default function App() {
  return <Routes>
    <Route path="/" element={<NewRoomForm />}/>
    <Route path="/room/new" element={<NewRoom />} />
    <Route path="/room/:id" element={<Room />} />
  </Routes>
}