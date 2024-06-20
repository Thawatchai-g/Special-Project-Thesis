import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.css'

export const DataContent = ({ handleItemClick, selectedType, selectedProvince }) => {
  const [data, setData] = useState([]);

  const userRef = collection(db, "addresses");
  useEffect(() => {
    const unsubscribe = loadRealtime();
    return () => {
      unsubscribe();
    }
  }, []);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(newData)
    })
    return () => {
      unsubscribe();
    }
  }

  const filteredData = data.filter((item) => {
    if (selectedType!=="default" && selectedProvince!=="default") {
      return item.approve === 'success' && item.watertype === selectedType && item.province === selectedProvince;
    } else if (selectedType!=="default") {
      return item.approve === 'success' && item.watertype === selectedType;
    } else if (selectedProvince!=="default") {
      return item.approve === 'success' && item.province === selectedProvince;
    } else if(selectedType==="default" && selectedProvince==="default") {
      return item.approve === 'success';
    }
  }).sort((a, b) => {
    return a.timestamp - b.timestamp;
  });

  const successData = Number(filteredData.length);
  const allSuccessData = Number(data.filter(item => item.approve === 'success').length);

  const handleDetailClick = (item) => {
    handleItemClick(item);
  };

  return (
    <div className="col-span-5 bg-white mr-3 mb-2">
      <div className="mx-4 my-5 text-lg">
        <span className="mx-4">จำนวนข้อมูล</span>
        <span className="mx-4">{successData}</span>
        <span className="mx-4">รายการ</span>
        <span>{"( "}จากข้อมูลทั้งหมด</span>
        <span className="mx-4">{allSuccessData}</span>
        <span>รายการ{" )"}</span>
      </div>
      <div className="bg-white pl-10 pb-6 rounded-lg" style={{ width: "100%", Height: "100%", minHeight: "69vh", maxHeight: "69vh", overflowY: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">รายการ</th>
              <th scope="col" style={{ width: "200px" }}>รายละเอียด</th>
              <th scope="col">ประเภทแหล่งน้ำ</th>
              <th scope="col">ตำบล</th>
              <th scope="col">อำเภอ</th>
              <th scope="col">จังหวัด</th>
              <th scope="col">ดูข้อมูล</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) =>
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.item}</td>
                <td style={{ width: "200px" }}>{item.description}</td>
                <td>{item.watertype}</td>
                <td>{item.district}</td>
                <td>{item.subdistrict}</td>
                <td>{item.province}</td>
                <td>
                  <a href="#" onClick={() => handleDetailClick(item.item)} style={{ color: "#0075FF" }}>รายละเอียด</a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
