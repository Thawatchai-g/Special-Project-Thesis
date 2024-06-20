import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    onSnapshot,
} from 'firebase/firestore';
import { Form } from 'react-bootstrap';

export const SelectSearch = ({ onValuesSelect }) => {

    const [data, setData] = useState([]);
    const [regionValue, setRegionValue] = useState("default");
    const [waterType, setWaterType] = useState("default");
    const [province, setProvince] = useState("default");

    const waterTypeRef = collection(db, "watertype");
    useEffect(() => {
        const unsubscribe = loadRealtime();
        return () => {
            unsubscribe();
        }
    }, []);

    const loadRealtime = () => {
        const unsubscribe = onSnapshot(waterTypeRef, (snapshot) => {
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

    const handleWaterType = (event) => {
        setWaterType(event.target.value);
    };

    const handleRegion = (event) => {
        setRegionValue(event.target.value);
    };

    const handleProvince= (event) => {
        setProvince(event.target.value);
    };

    useEffect(() => {
        onValuesSelect(waterType, province);
    }, [waterType, province]);

    return (
        <div style={{ fontFamily: "Prompt" }}>
            <Form.Select className="mb-4" onChange={handleWaterType}>
                <option value="default">ประเภทแหล่งน้ำ</option>
                <option value="default">เลือกแหล่งน้ำทุกประเภท</option>
                {data.map((item, index) => (
                    <option key={index} value={item.name}>{item.name}</option>
                ))}
            </Form.Select>
            <Form.Select className="mt-10 mb-4" onChange={handleRegion}>
                <option value="default">ภูมิภาค</option>
                <option value="default">เลือกทุกภูมิภาค</option>
                <option value="n">ภาคเหนือ</option>
                <option value="w">ภาคตะวันตก</option>
                <option value="c">ภาคกลาง</option>
                <option value="ne">ภาคตะวันออกเฉียงเหนือ</option>
                <option value="e">ภาคตะวันออก</option>
                <option value="s">ภาคใต้</option>
            </Form.Select>
            <Form.Select className="mt-10 mb-4" onChange={handleProvince}>
                <option value="default">จังหวัด</option>
                <option value="default">เลือกทุกจังหวัด</option>
                {regionValue === "default" && (
                    <>
                        <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                        <option value="จ.กระบี่">กระบี่</option>
                        <option value="จ.กาญจนบุรี">กาญจนบุรี</option>
                        <option value="จ.กาฬสินธุ์">กาฬสินธุ์</option>
                        <option value="จ.กำแพงเพชร">กำแพงเพชร</option>
                        <option value="จ.ขอนแก่น">ขอนแก่น</option>
                        <option value="จ.จันทบุรี">จันทบุรี</option>
                        <option value="จ.ฉะเชิงเทรา">ฉะเชิงเทรา</option>
                        <option value="จ.ชลบุรี">ชลบุรี</option>
                        <option value="จ.ชัยนาท">ชัยนาท</option>
                        <option value="จ.ชัยภูมิ">ชัยภูมิ</option>
                        <option value="จ.ชุมพร">ชุมพร</option>
                        <option value="จ.เชียงราย">เชียงราย</option>
                        <option value="จ.เชียงใหม่">เชียงใหม่</option>
                        <option value="จ.ตรัง">ตรัง</option>
                        <option value="จ.ตราด">ตราด</option>
                        <option value="จ.ตาก">ตาก</option>
                        <option value="จ.นครนายก">นครนายก</option>
                        <option value="จ.นครปฐม">นครปฐม</option>
                        <option value="จ.นครพนม">นครพนม</option>
                        <option value="จ.นครราชสีมา">นครราชสีมา</option>
                        <option value="จ.นครศรีธรรมราช">นครศรีธรรมราช</option>
                        <option value="จ.นครสวรรค์">นครสวรรค์</option>
                        <option value="จ.นนทบุรี">นนทบุรี</option>
                        <option value="จ.นราธิวาส">นราธิวาส</option>
                        <option value="จ.น่าน">น่าน</option>
                        <option value="จ.บึงกาฬ">บึงกาฬ</option>
                        <option value="จ.บุรีรัมย์">บุรีรัมย์</option>
                        <option value="จ.ปทุมธานี">ปทุมธานี</option>
                        <option value="จ.ประจวบคีรีขันธ์">ประจวบคีรีขันธ์</option>
                        <option value="จ.ปราจีนบุรี">ปราจีนบุรี</option>
                        <option value="จ.ปัตตานี">ปัตตานี</option>
                        <option value="จ.พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
                        <option value="จ.พังงา">พังงา</option>
                        <option value="จ.พัทลุง">พัทลุง</option>
                        <option value="จ.พิจิตร">พิจิตร</option>
                        <option value="จ.พิษณุโลก">พิษณุโลก</option>
                        <option value="จ.เพชรบุรี">เพชรบุรี</option>
                        <option value="จ.เพชรบูรณ์">เพชรบูรณ์</option>
                        <option value="จ.แพร่">แพร่</option>
                        <option value="จ.พะเยา">พะเยา</option>
                        <option value="จ.ภูเก็ต">ภูเก็ต</option>
                        <option value="จ.มหาสารคาม">มหาสารคาม</option>
                        <option value="จ.มุกดาหาร">มุกดาหาร</option>
                        <option value="จ.แม่ฮ่องสอน">แม่ฮ่องสอน</option>
                        <option value="จ.ยโสธร">ยโสธร</option>
                        <option value="จ.ยะลา">ยะลา</option>
                        <option value="จ.ร้อยเอ็ด">ร้อยเอ็ด</option>
                        <option value="จ.ระนอง">ระนอง</option>
                        <option value="จ.ระยอง">ระยอง</option>
                        <option value="จ.ราชบุรี">ราชบุรี</option>
                        <option value="จ.ลพบุรี">ลพบุรี</option>
                        <option value="จ.ลำปาง">ลำปาง</option>
                        <option value="จ.ลำพูน">ลำพูน</option>
                        <option value="จ.เลย">เลย</option>
                        <option value="จ.ศรีสะเกษ">ศรีสะเกษ</option>
                        <option value="จ.สกลนคร">สกลนคร</option>
                        <option value="จ.สงขลา">สงขลา</option>
                        <option value="จ.สตูล">สตูล</option>
                        <option value="จ.สมุทรปราการ">สมุทรปราการ</option>
                        <option value="จ.สมุทรสงคราม">สมุทรสงคราม</option>
                        <option value="จ.สมุทรสาคร">สมุทรสาคร</option>
                        <option value="จ.สระแก้ว">สระแก้ว</option>
                        <option value="จ.สระบุรี">สระบุรี</option>
                        <option value="จ.สิงห์บุรี">สิงห์บุรี</option>
                        <option value="จ.สุโขทัย">สุโขทัย</option>
                        <option value="จ.สุพรรณบุรี">สุพรรณบุรี</option>
                        <option value="จ.สุราษฎร์ธานี">สุราษฎร์ธานี</option>
                        <option value="จ.สุรินทร์">สุรินทร์</option>
                        <option value="จ.หนองคาย">หนองคาย</option>
                        <option value="จ.หนองบัวลำภู">หนองบัวลำภู</option>
                        <option value="จ.อ่างทอง">อ่างทอง</option>
                        <option value="จ.อุดรธานี">อุดรธานี</option>
                        <option value="จ.อุตรดิตถ์">อุตรดิตถ์</option>
                        <option value="จ.อุทัยธานี">อุทัยธานี</option>
                        <option value="จ.อุบลราชธานี">อุบลราชธานี</option>
                        <option value="จ.อำนาจเจริญ">อำนาจเจริญ</option>
                    </>
                )}
                {regionValue === "n" && (
                    <>
                        <option value="จ.เชียงราย">เชียงราย</option>
                        <option value="จ.เชียงใหม่">เชียงใหม่</option>
                        <option value="จ.น่าน">น่าน</option>
                        <option value="จ.พะเยา">พะเยา</option>
                        <option value="จ.แพร่">แพร่</option>
                        <option value="จ.แม่ฮ่องสอน">แม่ฮ่องสอน</option>
                        <option value="จ.ลำปาง">ลำปาง</option>
                        <option value="จ.ลำพูน">ลำพูน</option>
                        <option value="จ.อุตรดิตถ์">อุตรดิตถ์</option>
                    </>
                )}
                {regionValue === "c" && (
                    <>
                        <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                        <option value="จ.กำแพงเพชร">กำแพงเพชร</option>
                        <option value="จ.ชัยนาท">ชัยนาท</option>
                        <option value="จ.นครนายก">นครนายก</option>
                        <option value="จ.นครปฐม">นครปฐม</option>
                        <option value="จ.นครสวรรค์">นครสวรรค์</option>
                        <option value="จ.นนทบุรี">นนทบุรี</option>
                        <option value="จ.ปทุมธานี">ปทุมธานี</option>
                        <option value="จ.พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
                        <option value="จ.พิจิตร">พิจิตร</option>
                        <option value="จ.พิษณุโลก">พิษณุโลก</option>
                        <option value="จ.เพชรบูรณ์">เพชรบูรณ์</option>
                        <option value="จ.ลพบุรี">ลพบุรี</option>
                        <option value="จ.สมุทรปราการ">สมุทรปราการ</option>
                        <option value="จ.สมุทรสงคราม">สมุทรสงคราม</option>
                        <option value="จ.สมุทรสาคร">สมุทรสาคร</option>
                        <option value="จ.สระบุรี">สระบุรี</option>
                        <option value="จ.สิงห์บุรี">สิงห์บุรี</option>
                        <option value="จ.สุโขทัย">สุโขทัย</option>
                        <option value="จ.สุพรรณบุรี">สุพรรณบุรี</option>
                        <option value="จ.อ่างทอง">อ่างทอง</option>
                        <option value="จ.อุทัยธานี">อุทัยธานี</option>
                    </>
                )}
                {regionValue === "ne" && (
                    <>
                        <option value="จ.กาฬสินธุ์">กาฬสินธุ์</option>
                        <option value="จ.ขอนแก่น">ขอนแก่น</option>
                        <option value="จ.ชัยภูมิ">ชัยภูมิ</option>
                        <option value="จ.นครพนม">นครพนม</option>
                        <option value="จ.นครราชสีมา">นครราชสีมา</option>
                        <option value="จ.บึงกาฬ">บึงกาฬ</option>
                        <option value="จ.บุรีรัมย์">บุรีรัมย์</option>
                        <option value="จ.มหาสารคาม">มหาสารคาม</option>
                        <option value="จ.มุกดาหาร">มุกดาหาร</option>
                        <option value="จ.ยโสธร">ยโสธร</option>
                        <option value="จ.ร้อยเอ็ด">ร้อยเอ็ด</option>
                        <option value="จ.เลย">เลย</option>
                        <option value="จ.ศรีสะเกษ">ศรีสะเกษ</option>
                        <option value="จ.สกลนคร">สกลนคร</option>
                        <option value="จ.สุรินทร์">สุรินทร์</option>
                        <option value="จ.หนองคาย">หนองคาย</option>
                        <option value="จ.หนองบัวลำภู">หนองบัวลำภู</option>
                        <option value="จ.อุดรธานี">อุดรธานี</option>
                        <option value="จ.อุบลราชธานี">อุบลราชธานี</option>
                        <option value="จ.อำนาจเจริญ">อำนาจเจริญ</option>
                    </>
                )}
                {regionValue === "e" && (
                    <>
                        <option value="จ.จันทบุรี">จันทบุรี</option>
                        <option value="จ.ฉะเชิงเทรา">ฉะเชิงเทรา</option>
                        <option value="จ.ชลบุรี">ชลบุรี</option>
                        <option value="จ.ตราด">ตราด</option>
                        <option value="จ.ปราจีนบุรี">ปราจีนบุรี</option>
                        <option value="จ.ระยอง">ระยอง</option>
                        <option value="จ.สระแก้ว">สระแก้ว</option>
                    </>
                )}
                {regionValue === "w" && (
                    <>
                        <option value="จ.กาญจนบุรี">กาญจนบุรี</option>
                        <option value="จ.ตาก">ตาก</option>
                        <option value="จ.ประจวบคีรีขันธ์">ประจวบคีรีขันธ์</option>
                        <option value="จ.เพชรบุรี">เพชรบุรี</option>
                        <option value="จ.ราชบุรี">ราชบุรี</option>
                    </>
                )}
                {regionValue === "s" && (
                    <>
                        <option value="จ.กระบี่">กระบี่</option>
                        <option value="จ.ชุมพร">ชุมพร</option>
                        <option value="จ.ตรัง">ตรัง</option>
                        <option value="จ.นครศรีธรรมราช">นครศรีธรรมราช</option>
                        <option value="จ.นราธิวาส">นราธิวาส</option>
                        <option value="จ.ปัตตานี">ปัตตานี</option>
                        <option value="จ.พังงา">พังงา</option>
                        <option value="จ.พัทลุง">พัทลุง</option>
                        <option value="จ.ภูเก็ต">ภูเก็ต</option>
                        <option value="จ.ยะลา">ยะลา</option>
                        <option value="จ.ระนอง">ระนอง</option>
                        <option value="จ.สตูล">สตูล</option>
                        <option value="จ.สงขลา">สงขลา</option>
                        <option value="จ.สุราษฎร์ธานี">สุราษฎร์ธานี</option>
                    </>
                )}
            </Form.Select>
        </div>
    )
}
