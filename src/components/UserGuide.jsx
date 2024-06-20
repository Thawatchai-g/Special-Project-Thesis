import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import Navbar from './Navbar';
import guide1 from '../assets/img/userGuide/guide1.jpg'
import guide2 from '../assets/img/userGuide/guide2.jpg'
import guide3 from '../assets/img/userGuide/guide3.jpg'
import guide4 from '../assets/img/userGuide/guide4.jpg'
import guide5 from '../assets/img/userGuide/guide5.jpg'
import guide6 from '../assets/img/userGuide/guide6.jpg'
import guide7 from '../assets/img/userGuide/guide7.jpg'

function UserGuide() {
  return (
    <>
      <div className="h-screen">
        <Navbar />
        <div className="flex flex-col items-center">
          <div className="my-5 shadow-xl bg-white border-1 border-slate-300 pl-10 py-6 rounded-lg" style={{ width: "70%", Height: "70%", maxHeight: "70vh", overflowY: "auto" }}>
            <img src={guide1} alt="Image 1" />
            <img src={guide2} alt="Image 2" />
            <img src={guide3} alt="Image 3" />
            <img src={guide4} alt="Image 4" />
            <img src={guide5} alt="Image 5" />
            <img src={guide6} alt="Image 6" />
            <img src={guide7} alt="Image 7" />
          </div>
        </div>
      </div>
    </>
  );
}

export default UserGuide;