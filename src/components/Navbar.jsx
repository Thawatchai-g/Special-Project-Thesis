import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '/logo.png';
import { FaSignInAlt, FaSignOutAlt, FaRegFileAlt } from 'react-icons/fa';
import { auth } from '../firebase';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function Navbar() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <header className="navbar bg-base-100 pl-20 pr-10 py-2" style={{ backgroundColor: '#F8F8F8' }}>
      <div className="flex-none ml-3 px-5">
        <img src={Logo} alt="Company Logo" style={{ width: 170, height: 85 }} />
      </div>

      <div>
        {user ? (
          <div className="flex items-center">
            <div className="flex items-center">
              <span><b>สวัสดี</b> คุณ</span>
              <span>
              <NavDropdown title={(user?.displayName || 'User').split(' ')[0]} id="basic-nav-dropdown">
                  <NavDropdown.Item href="/editdata">แก้ไขข้อมูลส่วนตัว</NavDropdown.Item>
                </NavDropdown>
              </span>
            </div>
            <div className="flex-none">
              <button className="btn btn-ghost ml-10">
                <Link className="mr-3 flex items-center" to="/userguide"><FaRegFileAlt size={19}/><span className="ml-1">วิธีการใช้งาน</span></Link>
              </button>
            </div>
            <div className="flex-none">
              <button onClick={handleLogout} className="btn btn-ghost ml-5 mr-20">
                ออกจากระบบ  <FaSignOutAlt size={19} />
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="btn btn-ghost menu menu-horizontal px-15 ml-5 mr-20">
            สำหรับเจ้าหน้าที่ของหน่วยงาน
            <FaSignInAlt size={19} />
          </Link>
        )}
      </div>
    </header>
  );
}
