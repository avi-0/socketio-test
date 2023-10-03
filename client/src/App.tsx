import { Route, Routes } from "react-router-dom";
import NewRoom from "./components/NewRoom";
import NewRoomForm from "./components/NewRoomForm";
import Room from "./components/Room";

export default function App() {
  return <Routes>
    <Route path="/" element={<NewRoomForm />}/>
    <Route path="/room/new" element={<NewRoom />} />
    <Route path="/room/:id" element={<Room />} />
  </Routes>
}