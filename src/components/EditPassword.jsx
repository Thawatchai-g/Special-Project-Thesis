import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';
import Logo from '/logo.png';
import { auth } from '../firebase';

function EditPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const { forgotPassword } = useUserAuth();
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            setUser(authUser);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await forgotPassword(email);
            auth.signOut();
            alert("โปรดตรวจสอบอีเมล");
            navigate("/");
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    return (
        <div className="grid h-screen place-items-center">
            <div className="card w-96 bg-base-100 shadow-xl mx-auto rounded-none  bg-white">
                <div className="mx-auto">
                    <figure className="px-10 pt-10 mx-auto">
                        <img src={Logo} alt="" style={{ width: 190, height: 95 }} />
                    </figure>
                    <Form onSubmit={handleSubmit}>
                        <div className="card-body px-0 mx-0">
                            <p className="font-normal text-xl text-left mb-0">ลืมรหัสผ่าน</p>
                            <p className="text-left text-lg text-gray-400 mt-0 mb-1.5">โปรดกรอกข้อมูล</p>
                            <Form.Group className="mt-4" controlId="formBasicEmail">
                                <Form.Control
                                    type="email"
                                    placeholder="อีเมล"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            {error && <div className="text-center text-red-600 underline">{error}</div>}
                        </div>
                        <Button className="btn btn-primary rounded-full mt-2 px-20" type="submit">
                            <div className="text-lg text-white">รีเซ็ตรหัสผ่าน</div>
                        </Button>
                    </Form>
                    {user ? (
                        <div className="p-4 box mt-1 mb-2 text-center" style={{ color: "#0075FF" }}>
                            กลับหน้าหลัก? <Link className="link" to="/home">คลิกที่นี่</Link>
                        </div>
                    ) : (
                        <div className="p-4 box mt-1 mb-2 text-center" style={{ color: "#0075FF" }}>
                            เข้าสู่ระบบ? <Link className="link" to="/login">คลิก</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EditPassword;