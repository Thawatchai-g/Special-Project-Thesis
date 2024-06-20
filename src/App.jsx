import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import MapContent from './components/MapContent';
import 'leaflet/dist/leaflet.css';
import Menubar from './components/Menubar';
import { DataContent } from './components/DataContent';
import Detail from './components/Detail';

function App() {
  const [showMap, setShowMap] = useState(true);
  const [selectMaker] = useState("success");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState("default");
  const [selectedProvince, setSelectedProvince] = useState("default");

  const handleToggleCheckbox = () => {
    setShowMap(!showMap);
  };

  const handleItemClick = (item) => {
    setShowDetail(!showDetail);
    setSelectedItem(item);
  };

  const toggleDetail = () => {
    setShowDetail(!showDetail);
    setSelectedItem(null);
  };
  
  const handleValuesSelect = (waterType, province) => {
    setSelectedType(waterType);
    setSelectedProvince(province);
  };

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-7 gap-3">
        <Menubar handleToggleCheckbox={handleToggleCheckbox} onValuesSelect={handleValuesSelect}/>
        {showMap ? (
          <>
            {showDetail ? (
              <Detail selectedItem={selectedItem} onGoBack={toggleDetail} />
            ) : (
              <MapContent selectedItem={selectedItem} selectMaker={selectMaker} handleItemClick={handleItemClick} selectedType={selectedType} selectedProvince={selectedProvince} />
            )}
          </>
        ) : (
          <>
            {showDetail ? (
              <Detail selectedItem={selectedItem} onGoBack={toggleDetail} />
            ) : (
              <DataContent handleItemClick={handleItemClick} selectedType={selectedType} selectedProvince={selectedProvince}/>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
