import React, { useState } from 'react';
import Navbar from './Navbar';
import Menubar from './Menubar';
import Dashboard from './Dashboard';
import MapContent from './MapContent';
import { DataContent } from './DataContent';
import Detail from './Detail';

function Home() {
  //success
  const [showMap1, setShowMap1] = useState(false);
  //waiting
  const [showMap2, setShowMap2] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [selectMaker, setSelectMaker] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState("default");
  const [selectedProvince, setSelectedProvince] = useState("default");

  const handleToggleCheckbox = () => {
    setShowMap1(!showMap1);
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === 1) {
      setSelectMaker("waiting");
      setShowMap2(true);
      setShowDetail(false);
      setSelectedItem(false);
      setSelectedType("default");
      setSelectedProvince("default");
    } else {
      setSelectMaker("success");
      setShowMap1(false);
      setShowMap2(false);
      setShowDashboard(true);
      setShowDetail(false);
      setSelectedItem(false);
    }
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
    setSelectMaker("success");
    setShowMap1(!showMap1);
  };

  const handleItemClick = (item) => {
    setShowDashboard(false);
    setShowDetail(true);
    setSelectedItem(item);
  };

  const handlePopupClick = (item) => {
    setShowDetail(false);
    setShowDashboard(false);
    setShowMap2(true);
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
        <Menubar handleToggleCheckbox={handleToggleCheckbox} handleTabChange={handleTabChange} toggleDashboard={toggleDashboard} handlePopupClick={handlePopupClick} showDashboard={showDashboard} onValuesSelect={handleValuesSelect} /> {/* ส่งฟังก์ชัน toggleDashboard เข้าไปให้ Menubar */}
        {showDashboard || showMap2 ? (
          <>
            {showMap2 ? (
              <>
                {showDetail && selectedItem ? (
                  <Detail selectedItem={selectedItem} onGoBack={toggleDetail} isApproved={true} />
                ) : (
                  <MapContent selectedItem={selectedItem} selectMaker={selectMaker} handleItemClick={handleItemClick} selectedType={selectedType} selectedProvince={selectedProvince} />
                )}
              </>
            ) : (
              <Dashboard />
            )}
          </>
        ) : (
          <>
            {!showDashboard && showMap1 ? (
              <>
                {showDetail && selectedItem ? (
                  <Detail selectedItem={selectedItem} onGoBack={toggleDetail} />
                ) : (
                  <MapContent selectMaker={selectMaker} handleItemClick={handleItemClick} selectedType={selectedType} selectedProvince={selectedProvince} />
                )}
              </>
            ) : (
              <>
                {showDetail && selectedItem ? (
                  <Detail selectedItem={selectedItem} onGoBack={toggleDetail} />
                ) : (
                  <DataContent handleItemClick={handleItemClick} selectedType={selectedType} selectedProvince={selectedProvince}/>
                )}
              </>
            )}
          </>
        )}

      </div>
    </>
  );
}

export default Home;
