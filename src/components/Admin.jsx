import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.css'
import { Button } from 'react-bootstrap';
import { FaRegCheckSquare, FaRegWindowClose, FaRegEdit } from "react-icons/fa";
import { IconContext } from 'react-icons';
import Navbar from './Navbar';

function Admin() {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [displayType, setDisplayType] = useState('all');

  const userRef = collection(db, "users");
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

  const handleSelect = async (id, check) => {
    if (check) {
      try {
        await setDoc(doc(userRef, id), { approve: 'pass' }, { merge: true });
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    } else {
      try {
        await setDoc(doc(userRef, id), { approve: 'fail' }, { merge: true });
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
    setEditId(null);
  };

  const cleanData = data.filter((item) => {
    return item.position === 'web'||item.position === 'mobile';
  })

  const filteredData = cleanData.filter((item) => {
    if (displayType === 'all') {
      return true;
    } else if (displayType === 'wait') {
      return item.approve === 'wait';
    } else if (displayType === 'Approveds') {
      return item.approve === 'pass';
    } else if (displayType === 'NotApproved') {
      return item.approve === 'fail';
    }
    return false;
  })

  return (
    <>
      <div className="h-screen">
        <Navbar />
        <div className="flex flex-col items-center">
          <div className="my-5 shadow-xl bg-white border-1 border-slate-300 pl-10 py-6 rounded-lg" style={{ width: "70%", Height: "70%", maxHeight: "70vh", overflowY: "auto" }}>
            <div className="mb-4">
              <select
                className="mx-2 p-2 border border-gray-300 rounded"
                onChange={(e) => setDisplayType(e.target.value)}
                value={displayType}
              >
                <option value="all">All</option>
                <option value="wait">Wait</option>
                <option value="Approveds">Approved</option>
                <option value="NotApproved">Not Approved</option>
              </select>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Email</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phonenumber</th>
                  <th scope="col">Possition</th>
                  <th scope="col">Approve</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) =>
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.email}</td>
                    <td>{item.fullname}</td>
                    <td>{item.tel}</td>
                    <td>{item.position}</td>
                    <td>{item.approve}</td>
                    <td>
                      {item.approve === 'wait' ? (
                        <b>-</b>
                      ) : item.approve === 'pass' ? (
                        <IconContext.Provider value={{ color: 'green', size: '22px' }}>
                          <div><FaRegCheckSquare /></div>
                        </IconContext.Provider>
                      ) : item.approve === 'fail' ? (
                        <IconContext.Provider value={{ color: 'red', size: '22px' }}>
                          <div><FaRegWindowClose /></div>
                        </IconContext.Provider>
                      ) : null}
                    </td>
                    <td>
                      {item.approve === 'wait' || editId === item.id ? (
                        <>
                          <Button className="btn btn-outline" onClick={() => handleSelect(item.id, true)}>
                            Pass
                          </Button>
                          <Button className="btn btn-outline btn-error mx-3" onClick={() => handleSelect(item.id, false)} style={{ color: "red" }}>
                            Fail
                          </Button>
                        </>
                      ) : item.approve === 'pass' || item.approve === 'fail' ? (
                        <>
                          <Button className="btn btn-ghost" onClick={() => setEditId(item.id)}>
                            <IconContext.Provider value={{ size: '22px' }}>
                              <div><FaRegEdit /></div>
                            </IconContext.Provider>
                          </Button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;