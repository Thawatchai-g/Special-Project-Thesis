import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Home from './components/Home.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import ProtectedBack from './auth/ProtectedBack.jsx'
import ProtectedAdmin from './auth/ProtectedAdmin.jsx'
import EditPassword from './components/EditPassword.jsx'
import EditData from './components/EditData.jsx'
import Admin from './components/Admin.jsx'
import UserGuide from './components/userGuide.jsx'

import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css'
import { UserAuthContextProvider } from './context/UserAuthContext.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <ProtectedBack><Login /></ProtectedBack>
  },
  {
    path: "/register",
    element: <ProtectedBack><Register /></ProtectedBack>
  },
  {
    path: "/editpassword",
    element: <EditPassword />
  },
  {
    path: "/editdata",
    element: <ProtectedRoute><EditData /></ProtectedRoute>
  },
  {
    path: "/admin",
    element: <ProtectedAdmin><Admin /></ProtectedAdmin>
  },
  {
    path: "/home",
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: "/userguide",
    element: <UserGuide />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
)