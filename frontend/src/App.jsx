import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Create from "./pages/Create";
import ViewHisaab from "./pages/hisab";
import EditHisaab from "./pages/EditHisab";
import Scanner from "./pages/Scanner";
import RoomPage from "./pages/Rooms";
import PaymentApp from "./pages/Payment";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/payment" element={<PaymentApp />} />
        <Route path="/hisaab/:id/edit" element={<EditHisaab />} />
        <Route path="/hisaab/:id" element={<ViewHisaab />} />
         <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/create" element={<Create/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
