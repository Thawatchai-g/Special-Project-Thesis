import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'

function ProtectedAdmin({ children }) {

    const { user } = useUserAuth();
    
    if (!user) {
        return <Navigate to="/home" />
    } else if (user.email !== "rtkwater@gmail.com") {
        return <Navigate to="/" />
    }

  return children;
}

export default ProtectedAdmin