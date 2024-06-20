import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'

function ProtectedBack({ children }) {

    const { user } = useUserAuth();

    if (user) {
        if (user.email !== "rtkwater@gmail.com") {
            return <Navigate to="/home" />
        } else {
            return <Navigate to="/admin" />
        }
    }

  return children;
}

export default ProtectedBack