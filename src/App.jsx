import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Author from "./pages/Author";
import ItemDetails from "./pages/ItemDetails";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-wrapper">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/:id" element={<Explore />} />
        <Route path="/author" element={<Author />} />
        <Route path="/author/:authorId" element={<Author />} />
        <Route path="/item-details" element={<ItemDetails />} />
        <Route path="/item-details/:nftId" element={<ItemDetails />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;





