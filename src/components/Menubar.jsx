import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Tabs, Tab, Typography } from '@mui/material'
import { useUserAuth } from '../context/UserAuthContext';
import { Button } from 'react-bootstrap';
import { FaRegFileAlt, FaAngleRight, FaHistory } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { SelectSearch } from './SelectSearch';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Menubar({ handleToggleCheckbox, handleTabChange, toggleDashboard, handlePopupClick, showDashboard, onValuesSelect }) {
  const [data, setData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userRef = collection(db, "addresses");
  useEffect(() => {
    const unsubscribe = loadRealtime();
    return () => {
      unsubscribe();
    }
  }, []);

  const { user } = useUserAuth();

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(newData)
      setIsLoading(false);
    })
    return () => {
      unsubscribe();
    }
  }

  const filteredData = data.filter((item) => {
    return item.approve === 'waiting';
  }).sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    handleTabChange(event, newValue);
  };

  const handleDetailClick = (item) => {
    handlePopupClick(item);
  };

  return (
    <div className="col-span-2 bg-white ml-3 mb-2" style={{ height: "100% ", minHeight: "85vh", maxHeight: "85vh" }}>
      {isLoading ? (
        <div className='text-center my-10'>Loading...</div>
      ) : (
        <>
          {isLoggedIn ? (
            <Box>
              <Box sx={{ width: '100%', bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  TabIndicatorProps={{
                    sx: { backgroundColor: "#0075FF", height: 3 }
                  }}
                  centered
                >
                  <Tab
                    label={<span className="text-xl mt-3 mb-1">ค้นหา</span>}
                    sx={{ width: '50%', fontFamily: "Prompt", color: 'black' }}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label={
                      <div className="flex justify-between">
                        <span className="text-xl mt-3 mb-1">รออนุมัติ</span>
                        <span className="mt-3 ml-1 pt-1 w-6 h-6 rounded-full bg-orange-600">
                          <span className="text-white">{Number(filteredData.length)}</span>
                        </span>
                      </div>
                    }
                    sx={{ width: '50%', fontFamily: "Prompt", color: 'black' }}
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <div style={{ fontFamily: "Prompt" }}>
                  <div className="my-10 text-center">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="accent-sky-100 h-5 w-5" onChange={handleToggleCheckbox} />
                      <span className="ml-3 text-lg">แสดงข้อมูลเป็นรายการ</span>
                    </label>
                  </div>
                  <div className="mx-1 mt-4 mb-8 pt-3 pb-6 text-center">
                    <>
                      <SelectSearch onValuesSelect={onValuesSelect} />
                    </>
                  </div>
                  <div className="text-center mt-3">
                    {showDashboard ?
                      <Button className="bg-orange-500 hover:bg-orange-600 mt-3 btn rounded-full w-full place-items-center text-lg text-white" onClick={toggleDashboard} style={{ borderColor: 'orange' }}>
                        <span>ปิด Dashboard</span>
                      </Button>
                      :
                      <Button className="mt-3 btn btn-primary rounded-full w-full place-items-center text-lg text-white" style={{ color: "#0075FF" }} onClick={toggleDashboard}> {/* เพิ่ม onClick เพื่อเรียกใช้ toggleDashboard */}
                        <span>เปิด Dashboard</span>
                      </Button>
                    }
                  </div>
                  {showDashboard ?
                    <div className='mt-1 text-center text-lg text-slate-400'>- กรุณากดปิด Dashboard ก่อนค้นหาข้อมูล -</div>
                    :
                    <div className='mt-1 text-center text-lg text-slate-400'>- แสดง Dashboard กรุณากดเปิด -</div>
                  }
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <div className="text-center" style={{ fontFamily: "Prompt", Height: "70%", maxHeight: "70vh", overflowY: "auto" }}>
                  <table className="table">
                    <thead>
                      <tr className="text-lg">
                        <th className="px-2 text-center" scope="col">รายการ</th>
                        <th className="px-2 text-left" scope="col">ประเภทแหล่งน้ำ</th>
                        <th className="px-2 text-center" scope="col">ดูข้อมูล</th>
                      </tr>
                    </thead>
                    <tbody className="text-lg">
                      {filteredData.map((item, index) =>
                        <tr key={index}>
                          <td className="pr-1 mb-2 text-center">{item.item}</td>
                          <td className="px-1 text-lg">{item.watertype}</td>
                          <td className="pl-1 text-cente">
                            <a href="#" onClick={() => handleDetailClick(item.item)} style={{ color: "#0075FF" }}>รายละเอียด</a>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CustomTabPanel>
            </Box>
          ) : (
            <Box>
              <div style={{ fontFamily: "Prompt" }}>
                <div className="mx-3 mt-4 mb-5 text-center">
                  <div className="rounded-lg border-2 border-slate-200 py-4 flex justify-between">
                    <div className="ml-3 text-start flex items-center">
                      <FaRegFileAlt size={19} />
                      <span className="ml-2 "><b>วิธีการค้นหาข้อมูลแหล่งน้ำ</b></span>
                    </div>
                    <Link className="mr-3 flex items-center" to="/userguide">รายละเอียด<FaAngleRight size={22} /></Link>
                  </div>
                </div>
                <div className="mb-5 text-center">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="accent-sky-100 h-5 w-5" onChange={handleToggleCheckbox} />
                    <span className="ml-3 text-lg">แสดงข้อมูลเป็นรายการ</span>
                  </label>
                </div>
                <div className="mx-4 text-center">
                  <>
                    <SelectSearch onValuesSelect={onValuesSelect} />
                  </>
                </div>
              </div>
            </Box>
          )}
        </>
      )}
    </div>
  );
}
