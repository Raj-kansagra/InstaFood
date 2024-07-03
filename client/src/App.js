// src/App.js
// eslint-disable-next-line 
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lightTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import Authentication from "./pages/Authentication";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import FoodDetails from "./pages/FoodDetails";
import FoodListing from "./pages/FoodListing";
import { useSelector } from "react-redux";
import Orders from "./pages/Orders";
import { getUser } from "./api";
import { updateUser } from "./redux/reducers/UserSlice";
import { useDispatch } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Container = styled.div``;


function App() {
  const {currentUser} = useSelector((state) => state.user);
  const [openAuth, setOpenAuth] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=>{
    async function getalluser(){
      const token = localStorage.getItem("app-token");
      const user = await getUser(token);
      dispatch(updateUser(user.data));
    }
    getalluser();
  },[]);

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Container>
          <Navbar setOpenAuth={setOpenAuth}/>
          <Routes>
            <Route path="/" exact element={<Home/>} />
            {currentUser && (<Route path="/favorite" exact element={<Favourites/>} />)}
            {currentUser && (<Route path="/cart" exact element={<Cart/>} />)}
            {currentUser && (<Route path="/orders" exact element={<Orders/>} />)}
            <Route path="/dishes/:id" exact element={<FoodDetails setOpenAuth={setOpenAuth}/>} />
            <Route path="/dishes" exact element={<FoodListing/>} />
            <Route path="*" element={<Home/>} />
          </Routes>
          {openAuth && (
            <Authentication setOpenAuth={setOpenAuth} openAuth={openAuth} />
          )}
          <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} pauseOnHover={false} closeOnClick rtl={false}/>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
