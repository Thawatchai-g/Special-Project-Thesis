import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';
import Logo from '/logo.png';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore';
import { getAuth, updateProfile, updatePassword } from "firebase/auth";
import PropTypes from 'prop-types';
import { Box, Tabs, Tab, Typography } from '@mui/material'

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

function EditData() {
  const [value, setValue] = React.useState(0);
  const handleSwap = (event, newValue) => {
    setValue(newValue);
  };
  const [formData, setFormData] = useState({
    id: "",
    fullname: "",
    tel: "",
  });
  const[newPass, setNewPass] = useState("");
  const[confirmNewPass, setConfirmNewPass] = useState("");
  const [error, setError] = useState("");
  const { user } = useUserAuth();
  const auth = getAuth();
  const userCur = auth.currentUser;
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const [data, setData] = useState([]);

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

  useEffect(() => {
    const filteredData = data.find(item => item.uid === user.uid);
    if (filteredData) {
      setFormData({
        id: filteredData.id || "",
        fullname: filteredData.fullname || "",
        tel: filteredData.tel || "",
      });
    }
  }, [data, user]);

  const validateForm = () => {
    let errors = {};
    let isValid = true;
    if (formData.fullname === '') {
      errors.fullname = "กรุณากรอกชื่อ";
      isValid = false;
    }
    if (formData.tel === '') {
      errors.tel = "กรุณากรอกเบอร์โทรศัพท์";
      isValid = false;
    }
    setFieldErrors(errors);
    return isValid;
  };

  const validatePassForm = () => {
    let errors = {};
    let isValid = true;
    if (!newPass) {
      errors.newPass = "กรุณากรอกรหัสผ่านใหม่";
      isValid = false;
    } else if (newPass.length < 8) {
      errors.newPass = "ใช้อักขระ 8 ตัวขึ้นไปสำหรับรหัสผ่าน";
      isValid = false;
    }
    if (!confirmNewPass) {
      errors.confirmNewPass = "กรุณากรอกเพื่อยืนยันรหัสผ่านใหม่";
      isValid = false;
    } else if (confirmNewPass.length < 8) {
      errors.confirmNewPass = "ใช้อักขระ 8 ตัวขึ้นไปสำหรับรหัสผ่าน";
      isValid = false;
    }
    if (newPass !== confirmNewPass) {
      errors.newPass = "รหัสผ่านไม่ตรงกัน ลองอีกครั้ง";
      errors.confirmNewPass = "รหัสผ่านไม่ตรงกัน ลองอีกครั้ง";
      isValid = false;
    }
    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (validateForm()) {
      try {
        await updateProfile(user, { displayName: formData.fullname });
        const userDocRef = doc(userRef, formData.id);
        await updateDoc(userDocRef, {
          fullname: formData.fullname,
          tel: formData.tel
        });
        navigate("/");
      } catch (err) {
        setError("พบข้อผิดพลาด โปรดลองอีกครั้งภายหลัง");
        console.error(err);
      }
    }
  };

  const handleSubmitEditPass = async (e) => {
    e.preventDefault();
    setError("");
    if (validatePassForm()) {
      updatePassword(userCur, newPass).then(() => {
        console.log("Update successful.");
        auth.signOut();
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  const togglePasswordVisibility = () => {
    const input = document.getElementById('formBasicNewPass');
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
    const input2 = document.getElementById('formBasicConfirmNewPass');
    if (input2) {
      input2.type = input2.type === 'password' ? 'text' : 'password';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="card w-96 bg-base-100 shadow-xl mx-auto rounded-none bg-white">
        <div className="mt-9 mx-4">
          <div className="grid grid-cols-1 place-items-center">
            <img src={Logo} alt="" style={{ width: 190, height: 95 }} />
          </div>
          <Box sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Tabs
              value={value}
              onChange={handleSwap}
              TabIndicatorProps={{
                sx: { backgroundColor: "#0075FF", height: 3 }
              }}
              centered
            >
              <Tab
                label={<span className="text-xl mt-3 mb-1">ข้อมูลทั่วไป</span>}
                sx={{ width: '50%', fontFamily: "Prompt", color: 'black' }}
                {...a11yProps(0)}
              />
              <Tab
                label={<span className="text-xl mt-3 mb-1">รหัสผ่าน</span>}
                sx={{ width: '50%', fontFamily: "Prompt", color: 'black' }}
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
        </div>
        <CustomTabPanel value={value} index={0}>
          <div className="mx-4 mt-1 mb-4" style={{ fontFamily: "Prompt" }}>
            <p className="font-normal text-xl mb-0">แก้ไขข้อมูล</p>
            <p className="text-lg text-gray-400 mt-0 mb-1.5">โปรดกรอกข้อมูลใหม่</p>
          </div>
          <div>
            <Form onSubmit={handleSubmit}>
              <div className="mt-2 mb-2 ml-7 w-10/12">
                <Form.Group className="mb-4" controlId="formBasicName">
                  <Form.Control
                    type="text"
                    name="fullname"
                    placeholder="ชื่อ - สกุล"
                    value={formData.fullname}
                    onChange={handleChange}
                    isInvalid={fieldErrors.fullname}
                  />
                  <Form.Control.Feedback type="invalid">{fieldErrors.fullname}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicTel">
                  <Form.Control
                    type="text"
                    name="tel"
                    placeholder="เบอร์โทรศัพท์"
                    value={formData.tel}
                    onChange={handleChange}
                    isInvalid={fieldErrors.tel}
                  />
                  <Form.Control.Feedback type="invalid">{fieldErrors.tel}</Form.Control.Feedback>
                </Form.Group>
              </div>
              {error && <div className="text-center text-red-600 underline">{fieldErrors}</div>}
              <div className="grid grid-cols-1 place-items-center mt-5">
                <Button className="btn btn-primary rounded-full w-9/12" type="submit">
                  <div className="text-lg text-white">บันทึกการแก้ไข</div>
                </Button>
              </div>
            </Form>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <div className="mx-4 mt-1 mb-4" style={{ fontFamily: "Prompt" }}>
            <p className="font-normal text-xl mb-0">เปลี่ยนรหัสผ่าน</p>
            <p className="text-lg text-gray-400 mt-0 mb-1.5">โปรดกรอกข้อมูล</p>
          </div>
          <Form onSubmit={handleSubmitEditPass}>
            <div className="mt-2 mb-2 ml-7 w-10/12">
              <Form.Group className="mb-4" controlId="formBasicNewPass">
                <Form.Control
                  type="password"
                  placeholder="รหัสผ่านใหม่"
                  onChange={(e) => setNewPass(e.target.value)}
                  isInvalid={fieldErrors.newPass}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.newPass}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formBasicConfirmNewPass">
                <Form.Control
                  type="password"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  onChange={(e) => setConfirmNewPass(e.target.value)}
                  isInvalid={fieldErrors.confirmNewPass}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.confirmNewPass}</Form.Control.Feedback>
              </Form.Group>
              <div className="flex items-center mt-2 ml-1">
                <input type="checkbox" className="accent-sky-100 h-4 w-4" onChange={togglePasswordVisibility} />
                <span className="ml-1 text-slate-400">แสดงรหัสผ่าน</span>
              </div> 
            </div>
            {/* {error && <div className="text-center text-red-600 underline">{fieldErrors}</div>} */}
            <div className="grid grid-cols-1 place-items-center mt-3">
              <Button className="btn btn-primary rounded-full w-9/12" type="submit">
                <div className="text-lg text-white">บันทึกการแก้ไข</div>
              </Button>
            </div>
          </Form>
        </CustomTabPanel>
        <div className="mb-4 text-center" style={{ color: "#0075FF" }}>
          กลับหน้าหลัก? <Link className="link" to="/home">คลิกที่นี่</Link>
        </div>
      </div>
    </div>
  );
}

export default EditData;
