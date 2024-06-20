import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';
import { FaSignInAlt } from "react-icons/fa";
import Logo from '/logo.png';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUserAuth();
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    let isValid = true;
    if (!email) {
      errors.email = "กรุณากรอกอีเมล";
      isValid = false;
    }
    if (!password) {
      errors.password = "กรุณากรอกรหัสผ่าน";
      isValid = false;
    }
    setFieldErrors(errors);
    return isValid;
  };

  const togglePasswordVisibility = () => {
    const input = document.getElementById('formBasicPassword');
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  };

  const fetchUserDataFromFirestore = async (email) => {
    const db = getFirestore();
    const q = query(collection(db, 'users'), where('email', '==', email));
    try {
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (validateForm()) {
      try {
        const userData = await fetchUserDataFromFirestore(email);
        
        if (userData) {
          if (userData.approve === "pass") {
            if (userData.position === "web") {
              await logIn(email, password);
              navigate("/home");
            } else if (userData.position === "admin") {
              await logIn(email, password);
              navigate("/admin");
            } else {
              setError("Invalid position");
            }
          } else {
            setError("User not approved");
          }
        } else {
          setError("User not found");
        }
      } catch (err) {
        if (err.code === "auth/invalid-credential") {
          setError("โปรดตรวจสอบอีเมลและรหัสผ่าน");
        } else {
          setError("พบข้อผิดพลาด โปรดลองอีกครั้งภายหลัง");
        }
        console.error(err);
      }
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="card w-96 bg-base-100 shadow-xl mx-auto rounded-none bg-white">
        <div className="mx-auto">
          <div className="grid grid-cols-1 place-items-center pt-10">
            <img src={Logo} alt="" style={{ width: 190, height: 95 }} />
          </div>

          <Form onSubmit={handleSubmit}>
            <div className="card-body px-0 mx-0">
              <p className="font-normal text-xl text-left mb-0">เข้าสู่ระบบ</p>
              <p className="text-left text-lg text-gray-400 mt-0 mb-1.5">โปรดกรอกข้อมูล</p>

              <Form.Group className="mt-4 mb-3" controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="อีเมล"
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={fieldErrors.email}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  placeholder="รหัสผ่าน"
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={fieldErrors.password}
                />
                <div className="flex justify-between">
                  <div className="flex items-center mt-1 ml-1">
                    <input type="checkbox" className="accent-sky-100 h-4 w-4" onChange={togglePasswordVisibility} />
                    <span className="ml-1 text-slate-400">แสดงรหัสผ่าน</span>
                  </div>
                  <Link className="mt-1 text-slate-400" to="/editpassword">ลืมรหัสผ่าน</Link>
                </div>
                <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
              </Form.Group>

              {error && <div className="text-center text-red-600 underline">{error}</div>}
            </div>

            <div className="grid grid-cols-1 place-items-center">
              <Button className="btn btn-primary rounded-full mt-2 px-20" type="submit">
                <div className="text-lg text-white"><FaSignInAlt /></div>
                <div className="text-lg text-white">เข้าสู่ระบบ</div>
              </Button>
            </div>
          </Form>

          <div className="p-4 box mt-1 mb-2 text-center" style={{ color: "#0075FF" }}>
            ยังไม่ได้สมัครสมาชิก? <Link className="link" to="/register">สมัครสมาชิก</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;