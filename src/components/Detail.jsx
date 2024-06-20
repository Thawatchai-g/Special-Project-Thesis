import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { FaFileDownload } from "react-icons/fa";
import JSZip from 'jszip';

function Detail(props) {
  const { children, value, index, ...other } = props;
  const selectItem = props.selectedItem;

  const [data, setData] = useState([]);
  const [dataStaff, setDataStaff] = useState([]);

  const addressRef = collection(db, "addresses");
  useEffect(() => {
    const unsubscribe = loadRealtime();
    return () => {
      unsubscribe();
    }
  }, []);

  const userRef = collection(db, "users");
  useEffect(() => {
    const unsubscribe = loadRealtime2();
    return () => {
      unsubscribe();
    }
  }, []);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(addressRef, (snapshot) => {
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

  const loadRealtime2 = () => {
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setDataStaff(newData)
    })
    return () => {
      unsubscribe();
    }
  }

  const filteredData = data.filter((item) => {
    return item.item === selectItem;
  });
  const addedByValues = filteredData.map(item => item.added_by);
  const filteredStaffData = dataStaff.filter(item => addedByValues.includes(item.email));
  const dmy = filteredData.map(item => {
    const timestamp = item.timestamp;
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  });
  const dataTime = filteredData.map(item => {
    const timestamp = item.timestamp;
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  });

  let urlImageCount = 0;

  filteredData.forEach(item => {
    if (item.urlImage1) urlImageCount++;
    if (item.urlImage2) urlImageCount++;
    if (item.urlImage3) urlImageCount++;
    if (item.urlImage4) urlImageCount++;
    if (item.urlImage5) urlImageCount++;
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupImage, setPopupImage] = useState('');

  const handleImageClick = (imageUrl) => {
    setPopupImage(imageUrl);
    setShowPopup(true);
  };

  const handleApprove = () => {
    filteredData.forEach(async (item) => {
      const itemRef = doc(db, 'addresses', item.id);
      await setDoc(itemRef, { ...item, approve: 'success' }, { merge: true });
    });
  };

  const handleRefuse = () => {
    filteredData.forEach(async (item) => {
      const itemRef = doc(db, 'addresses', item.id);
      await setDoc(itemRef, { ...item, approve: 'refuse' }, { merge: true });
    });
  };

  const handleGoBack = () => {
    if (props.onGoBack) {
      props.onGoBack();
    }
  };

  const downloadTextFile = () => {
    const dataAsString = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([dataAsString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.txt';
    link.click();
  };

  const downloadJsonFile = () => {
    const dataAsString = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([dataAsString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();
  };

  const downloadCSVFile = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      filteredData.map(item => Object.values(item).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.click();
  };

  const downloadZip = () => {
    const zip = new JSZip();

    const textData = JSON.stringify(filteredData, null, 2);
    zip.file('data.txt', textData);

    const jsonData = JSON.stringify(filteredData, null, 2);
    zip.file('data.json', jsonData);

    const csvContent = filteredData.map(item => Object.values(item).join(',')).join('\n');
    zip.file('data.csv', csvContent);

    zip.generateAsync({ type: 'blob' }).then(content => {
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.zip';
      link.click();
    });
  };

  return (
    <div className="col-span-5 bg-white mb-2 mr-3 p-4" style={{ height: "100% ", minHeight: "85vh", maxHeight: "85vh" }}>
      <div className="mb-4">
        <Link className="link" onClick={handleGoBack}><span className="text-lg">ย้อนกลับ</span></Link>
      </div>
      <div className="m-2 grid grid-cols-5 gap-10">
        <div className="mt-2 col-span-3">
          <div className="grid grid-cols-2 gap-1">
            <div className="col-span-1">
              <div>
                {filteredData.map((item, index) => (
                  <div key={index} className="mb-4 text-xl"><b>{item.watertype}</b></div>
                ))}
              </div>
              <div className="grid grid-cols-3">
                <div className="col-span-1">
                  <div className="mb-3"><b>รายการที่</b></div>
                  <div className="mb-3"><b>ตำบล</b></div>
                  <div className="mb-3"><b>อำเภอ</b></div>
                  <div className="mb-3"><b>จังหวัด</b></div>
                </div>
                <div className="col-span-2">
                  {filteredData.map((item, index) => (
                    <div key={index}>
                      <div className="mb-3">{item.item}</div>
                      <div className="mb-3">{item.subdistrict}</div>
                      <div className="mb-3">{item.district}</div>
                      <div className="mb-3">{item.province}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-1 mt-1">
              <div className="text-right">
                <span>{dmy}</span>
                <span className="ml-5">{dataTime}</span>
              </div>
              <div className="col-span-1 mt-4">
                <div className="grid grid-cols-5">
                  <div className="col-span-2">
                    <div className="mb-3"><b>Accuracy</b></div>
                    <div className="mb-3"><b>Altitude</b></div>
                    <div className="mb-3"><b>Latitude</b></div>
                    <div className="mb-3"><b>Longitude</b></div>
                  </div>
                  <div className="col-span-3">
                    {filteredData.map((item, index) => (
                      <div key={index}>
                        <div className="mb-3">{item.accuracy} m</div>
                        <div className="mb-3">{item.altitude}</div>
                        <div className="mb-3">{item.latitude}</div>
                        <div className="mb-3">{item.longitude}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-3 grid grid-cols-3 gap-3" style={{ minHeight: "40vh", maxHeight: "40vh", overflowY: "auto" }}>
              {filteredData.map((item, outerIndex) => (
                Array.from({ length: urlImageCount }, (_, innerIndex) => (
                  <img
                    key={innerIndex}
                    src={item[`urlImage${innerIndex + 1}`]}
                    alt={`Image ${innerIndex}`}
                    className="w-full"
                    onClick={() => handleImageClick(item[`urlImage${innerIndex + 1}`])}
                  />
                ))
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-2 mt-1">
          {filteredStaffData.map((item, index) => (
            <div key={index}>
              <div className="mt-2 mb-3 text-lg">ข้อมูลพนักงานที่เพิ่มข้อมูล</div>
              <div className="px-4 py-3 Align-center bg-gray-100">
                <div className="mb-2"><b>ชื่อ-สกุล</b> {item.fullname}</div>
                <div className="mb-2"><b>อีเมล</b> {item.email}</div>
                <div><b>เบอร์โทร</b> {item.tel}</div>
              </div>
            </div>
          ))}
          <div className="mt-4 mb-3 text-lg">รายละเอียดเพิ่มเติม</div>
          <div className="mb-4 px-4 py-4 Align-center bg-gray-100 min-h-35">
            {filteredData.map((item, index) => (<div key={index}><b>{item.description}</b></div>))}
          </div>
          <div className="mt-4 mb-3 text-lg">บรรยายเสียง</div>
          <div className="px-2 py-2 Align-center bg-gray-100 min-h-10">
            {filteredData.map((item, index) => (
              <div key={index}>
                <audio controls>
                  <source src={item.urlAudio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
          <div className="my-1 py-3 grid grid-cols-2 gap-1">
            {props.isApproved && (
              <>
                <div className="col-sapn-1 text-center">
                  <button onClick={() => { handleApprove(); handleGoBack(); }} className="bg-blue-600 hover:bg-blue-800 text-xl text-white font-bold py-2 px-5 rounded-full">อนุมัติ</button>
                </div>
                <div className="col-sapn-2 text-center">
                  <button onClick={() => { handleRefuse(); handleGoBack(); }} className="bg-red-500 hover:bg-red-700 text-xl text-white font-bold py-2 px-5 rounded-full">ไม่อนุมัติ</button>
                </div>
              </>
            )}
            {!props.isApproved && (
              <div className="dropdown dropdown-right dropdown-end text-center">
                <div tabIndex={0} role="button" className="btn my-1 bg-green-500 hover:bg-green-700 text-white text-xl rounded-full min-w-min flex items-center">
                  <FaFileDownload />ดาวน์โหลด
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a onClick={downloadTextFile}>Text(.txt)</a></li>
                  <li><a onClick={downloadJsonFile}>JSON(.json)</a></li>
                  <li><a onClick={downloadCSVFile}>CSV(.csv)</a></li>
                  <li><a onClick={downloadZip}>All File(.zip)</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-2" style={{ width: "35%", maxHeight: "100%" }}>
            <button
              className="absolute top-3 right-3 m-2 text-white w-6 h-6 rounded-full bg-orange-600"
              onClick={() => setShowPopup(false)}>
              X
            </button>
            <img src={popupImage} alt="Popup Image" style={{ width: "100%", maxHeight: "100%" }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Detail;
