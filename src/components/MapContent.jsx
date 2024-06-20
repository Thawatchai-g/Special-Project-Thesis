import React from 'react';
import { MapContainer } from 'react-leaflet';
import BaseMap from './Layer/BaseMap';
import MakerLocation from './Layer/MakerLocation';
export default function MapContent(props) {
  const { children, value, index, ...other } = props;
  const selectMakerValue = props.selectMaker;
  const selectedItem = props.selectedItem;
  const selectedType = props.selectedType;
  const selectedProvince = props.selectedProvince;

  return (
    <div className="col-span-5 bg-white mr-3 mb-2">
        <MapContainer
          style={{ width:"100%", height:"100% ", minHeight: "85vh", maxHeight: "85vh"}} 
          center={[13, 100]} //la and long center ไทย
          zoom={6}
        >
          <BaseMap/>
          <MakerLocation selectedItem={selectedItem} selectMaker={selectMakerValue} handleItemClick={props.handleItemClick} selectedType={selectedType} selectedProvince={selectedProvince} />
        </MapContainer>
    </div>
  );
}
