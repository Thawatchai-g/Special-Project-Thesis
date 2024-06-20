import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import Logo from '/logo.png'

function Register() {
  const { signUp } = useUserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullName] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [tel, setTel] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");

  let navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!fullname) {
      errors.fullname = "กรุณากรอกชื่อ-สกุล";
      isValid = false;
    }

    if (!email) {
      errors.email = "กรุณากรอกอีเมล";
      isValid = false;
    }

    if (!password) {
      errors.password = "กรุณากรอกรหัสผ่าน";
      isValid = false;
    } else if (password.length < 8) {
      errors.password = "ใช้อักขระ 8 ตัวขึ้นไปสำหรับรหัสผ่าน";
      isValid = false;
    }

    if (!confirmpassword) {
      errors.confirmpassword = "กรุณากรอกยืนยันรหัสผ่าน";
      isValid = false;
    } else if (confirmpassword.length < 8) {
      errors.confirmpassword = "ใช้อักขระ 8 ตัวขึ้นไปสำหรับรหัสผ่าน";
      isValid = false;
    }

    if (password !== confirmpassword) {
      errors.password = "รหัสผ่านไม่ตรงกัน ลองอีกครั้ง";
      errors.confirmpassword = "รหัสผ่านไม่ตรงกัน ลองอีกครั้ง";
      isValid = false;
    }

    if (!tel) {
      errors.tel = "กรุณากรอกหมายเลขโทรศัพท์";
      isValid = false;
    }
    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await signUp(fullname, email, password, tel);

        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTel("");
        setFieldErrors({});

        navigate("/");
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          setError("อีเมลดังกล่าวถูกใช้สมัครแล้ว โปรดลองอีเมลอื่น");
        }
        console.error(err);
      }
    }
  }

  const togglePasswordVisibility = () => {
    const input = document.getElementById('formBasicPassword');
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
    const input2 = document.getElementById('formBasicpassword-confirm');
    if (input2) {
      input2.type = input2.type === 'password' ? 'text' : 'password';
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="shadow-xl bg-white border-1 border-slate-300" style={{ width: "55%", minHeight: "80%" }}>
        <div className="grid grid-cols-1 place-items-center my-4 pt-3 pb-2">
          <img src={Logo} alt="" style={{ width: 190, height: 95 }} />
        </div>
        <div className="mb-10 ml-8 pl-7">
          <p className="font-normal text-xl text-left mb-0">สมัครสมาชิก</p>
          <p className="text-left text-lg text-gray-400 mt-0 mb-1.5">โปรดกรอกข้อมูล</p>
        </div>

        <div className="mx-7 px-8" >
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <Form.Group controlId="formBasicName">
                <Form.Control
                  type="text"
                  placeholder="ชื่อ - สกุล"
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                  isInvalid={fieldErrors.fullname}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.fullname}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="อีเมล"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={fieldErrors.email}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={fieldErrors.password}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicpassword-confirm">
                <Form.Control
                  type="password"
                  placeholder="ยืนยันรหัสผ่าน"
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={fieldErrors.confirmpassword}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.confirmpassword}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicTel">
                <Form.Control
                  type="text"
                  placeholder="เบอร์โทรศัพท์"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  isInvalid={fieldErrors.tel}
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.tel}</Form.Control.Feedback>
              </Form.Group>
              <div className="flex items-center mt-1 ml-1">
                <input type="checkbox" className="accent-sky-100 h-4 w-4" onChange={togglePasswordVisibility} />
                <span className="ml-1 text-slate-400">แสดงรหัสผ่าน</span>
              </div>  
            </div>

            {error && <div className="text-center text-red-600 underline">{error}</div>}

            <div className="grid grid-cols-1 place-items-center mt-3">
              <Button className="btn btn-wide btn-primary rounded-full" type="submit">
                <div className="text-lg text-white">สมัครสมาชิก</div>
              </Button>
            </div>
          </Form>
        </div>

        <div className="p-4 box mt-1 mb-2 text-center" style={{ color: "#0075FF" }}>
          มีบัญชีผู้ใช้อยู่แล้ว? <Link className="link" to="/login">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;