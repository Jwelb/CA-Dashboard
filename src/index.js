import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import Chat from './pages/Chat';
import Help from './pages/Help';
import Search from './pages/Search';
import Map from './pages/Map';
import Settings from './pages/Settings';
import Trends from './pages/Trends';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/Chat",
    element: <Chat/>
  },
  {
    path: "/Help",
    element: <Help/>
  },
  {
    path: "/Map",
    element: <Map/>
  },
  {
    path: "/Search",
    element: <Search/>
  },
  {
    path: "/Settings",
    element: <Settings/>
  },
  {
    path: "/Trends",
    element: <Trends/>
  },
]) ;


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);


