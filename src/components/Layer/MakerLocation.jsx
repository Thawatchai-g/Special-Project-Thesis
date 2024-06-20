import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { Marker, Popup, useMap } from 'react-leaflet';
import redicon from '../../assets/img/location.png';
import blueicon from '../../assets/img/placeholder.png';
import L from 'leaflet';

function MakerLocation(props) {
  const { children, value, index, ...other } = props;
  const selectMakerValue = props.selectMaker;
  const selectedItem = props.selectedItem;
  const selectedType = props.selectedType;
  const selectedProvince = props.selectedProvince;
  const [markerData, setMarkerData] = useState([]);
  const map = useMap();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const addressesCollection = collection(db, 'addresses');

    const snapshot = await getDocs(addressesCollection);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setMarkerData(data);

    const unsubscribe = onSnapshot(addressesCollection, (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMarkerData(updatedData);
    });
    return () => unsubscribe();
  };

  useEffect(() => {
    if (selectedItem) {
      const selectedMarker = markerData.find(item => item.item === selectedItem);
      if (selectedMarker) {
        map.flyTo([selectedMarker.latitude, selectedMarker.longitude], 17);
      }
    }
  }, [selectedItem, markerData, map]);

  const filteredData = markerData.filter(item => {
    if (selectedType!=="default" && selectedProvince!=="default") {
      return item.approve === selectMakerValue && item.watertype === selectedType && item.province === selectedProvince;
    } else if (selectedType!=="default") {
      return item.approve === selectMakerValue && item.watertype === selectedType;
    } else if (selectedProvince!=="default") {
      return item.approve === selectMakerValue && item.province === selectedProvince;
    } else if(selectedType==="default" && selectedProvince==="default") {
      return item.approve === selectMakerValue;
    }
  });

  return selectedItem
    ? markerData.filter(item => item.approve === selectMakerValue && item.item === selectedItem).map((item, index) => (
      <Marker key={index} position={[item.latitude, item.longitude]} icon={selectMakerValue === "waiting" ? redMarkerIcon : blueMarkerIcon}>
        <Popup style={{ width: '300px' }}>
          <div style={{ fontFamily: "Prompt" }}>
            <div><img src={item.urlImage1} style={{ width: '100%' }} alt="Item Image" /></div>
            <div className="mt-3 mb-2 text-xl"><b>{item.watertype}({item.item})</b></div>
            <div className="mb-2">Latitude :<b>{item.latitude}</b></div>
            <div >Longitude: <b>{item.longitude}</b></div>
            <div className="my-2 text-center">
              <a href="#"
                className="text-xl"
                style={{ color: "#0075FF" }}
                onClick={() => props.handleItemClick(item.item)}>
                รายละเอียด
              </a>
            </div>
          </div>
        </Popup>
      </Marker>
    ))
    : filteredData.map((item, index) => (
      <Marker key={index} position={[item.latitude, item.longitude]} icon={selectMakerValue === "waiting" ? redMarkerIcon : blueMarkerIcon}>
        <Popup style={{ width: '300px' }}>
          <div style={{ fontFamily: "Prompt" }}>
            <div><img src={item.urlImage1} style={{ width: '100%' }} alt="Item Image" /></div>
            <div className="mt-3 mb-2 text-xl"><b>{item.watertype}({item.item})</b></div>
            <div className="mb-2">Latitude :<b>{item.latitude}</b></div>
            <div >Longitude: <b>{item.longitude}</b></div>
            <div className="my-2 text-center">
              <a href="#"
                className="text-xl"
                style={{ color: "#0075FF" }}
                onClick={() => props.handleItemClick(item.item)}>
                รายละเอียด
              </a>
            </div>
          </div>
        </Popup>
      </Marker>));
}

// กำหนดสีของ Marker ให้เป็นสีน้ำเงิน
const blueMarkerIcon = L.icon({
  iconUrl: blueicon,
  iconSize: [28, 28],
  iconAnchor: [12.5, 20.5]
});

// กำหนดสีของ Marker ให้เป็นสีแดง
const redMarkerIcon = L.icon({
  iconUrl: redicon,
  iconSize: [28, 28],
  iconAnchor: [12.5, 20.5]
});

export default MakerLocation;
