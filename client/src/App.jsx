import React from 'react'
import {  createBrowserRouter,  createRoutesFromElements,  Route,  RouterProvider,} from "react-router-dom";
import Home from '../src/pages/Home';
import About from '../src/pages/About';
import Profile from '../src/pages/Profile';
import SignIn from '../src/pages/SignIn';
import SignUp from '../src/pages/SignUp';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route element={<PrivateRoute/>}>
        <Route path="profile" element={<Profile />} />
        </Route>
    
      
      </Route>
      
    )
  );
  
  return (
    <>
      <RouterProvider router={router}/>
      <ToastContainer />
    </>
  )
}

export default App
