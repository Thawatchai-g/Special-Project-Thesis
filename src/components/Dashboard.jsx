import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import Form from 'react-bootstrap/Form';
import { db } from '../firebase';
import {
    collection,
    onSnapshot,
} from 'firebase/firestore';

const currentYear = new Date().getFullYear();

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [timestamps, setTimestamps] = useState([]);
    const [selectedYear, setSelectedYear] = useState(currentYear);

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

    useEffect(() => {
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
            const newTimestamps = snapshot.docs.map((doc) => {
                return new Date(doc.data().timestamp).getFullYear();
            });
            setTimestamps(newTimestamps);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
    };

    const years = Array.from(new Set(timestamps));

    const successData = Number(data.filter(item => item.approve === 'success').length);
    const waitData = Number(data.filter(item => item.approve === 'waiting').length);
    const refuseData = Number(data.filter(item => item.approve === 'refuse').length);
    const cancelData = Number(data.filter(item => item.approve === 'cancel').length);

    const allData = Number(data.length);
    const successDataValue = Number((successData * 100) / allData).toFixed(2);
    const waitDataValue = Number((waitData * 100) / allData).toFixed(2);
    const refuseDataValue = Number(((refuseData) * 100) / allData).toFixed(2);
    const cancelDataValue = Number(((cancelData) * 100) / allData).toFixed(2);

    const countDataByMonth = () => {
        const monthlyCounts = Array.from({ length: 12 }, () => 0); //สร้าง Array เก็บข้อมูลตามเดือน
        //นับจำนวนข้อมูลตามเดือน
        data.forEach(item => {
            const date = new Date(item.timestamp);
            const year = date.getFullYear();
            if (year === selectedYear) {
                const month = date.getMonth();
                monthlyCounts[month]++;
            }
        });
        return monthlyCounts;
    };

    const monthlyData = countDataByMonth();
    const monthLabels = [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤศภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม'
    ];

    return (
        <div className="col-span-5 bg-white mb-2 mr-3"
            style={{ height: "100% ", minHeight: "85vh", maxHeight: "85vh", overflowY: "auto" }}>
            <div className="grid grid-cols-2 gap-1 mx-4 mt-4 mb-1 pt-1">
                <div>
                    <div className="flex justify-between mr-10">
                        <span className="text-xl mb-2 ml-10">
                            สรุปผลการเพิ่มข้อมูลแหล่งน้ำ
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        <div className="mr-10 pr-10">
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            { id: 0, value: waitData, color: 'rgba(255, 205, 86, 0.8)' },
                                            { id: 1, value: cancelData, color: '#DCDCDC' },
                                            { id: 2, value: refuseData, color: 'rgba(255, 99, 132, 0.8)' },
                                            { id: 3, value: successData, color: 'rgba(54, 162, 235, 0.8)' }
                                        ],
                                        innerRadius: 50,
                                        outerRadius: 100,
                                        paddingAngle: 3,
                                        cornerRadius: 0,
                                        startAngle: 0,
                                        endAngle: 360,
                                    },
                                ]}
                                width={450}
                                height={250}
                            />
                        </div>
                        <div className="mt-3 ml-10 pl-10">
                            <div className="ml-10 inline-flex">
                                <span className="mt-1 w-8 h-8 rounded-full" style={{ backgroundColor: 'rgba(54, 162, 235, 0.8)' }}></span>
                                <span className="ml-2">
                                    <p className="text-gray-400">สำเร็จ</p>
                                    <p className="text-black font-bold">{successDataValue} %</p>
                                </span>
                            </div>
                            <div className="mt-3 ml-10 inline-flex">
                                <span className="mt-1 w-8 h-8 rounded-full" style={{ backgroundColor: 'rgba(255, 205, 86, 0.8)' }}></span>
                                <span className="ml-2">
                                    <p className="text-gray-400">รออนุมัติ</p>
                                    <p className="text-black font-bold">{waitDataValue} %</p>
                                </span>
                            </div>
                            <div className="mt-3 ml-10 inline-flex">
                                <span className="mt-1 w-8 h-8 rounded-full" style={{ backgroundColor: 'rgba(255, 99, 132, 0.8)' }}></span>
                                <span className="ml-2">
                                    <p className="text-gray-400">ไม่สำเร็จ</p>
                                    <p className="text-black font-bold">{refuseDataValue} %</p>
                                </span>
                            </div>
                            <div className="mt-3 ml-10 inline-flex">
                                <span className="mt-1 w-8 h-8 rounded-full" style={{ backgroundColor: '#DCDCDC' }}></span>
                                <span className="ml-2">
                                    <p className="text-gray-400">ยกเลิก</p>
                                    <p className="text-black font-bold">{cancelDataValue} %</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-5 gap-0 mt-5 ml-8">
                    <div className="col-span-2 text-lg ">
                        <p className="mb-4"><b>จำนวนการเพิ่มข้อมูล</b></p>
                        <p className="mb-3">การเพิ่มข้อมูลสำเร็จ</p>
                        <p className="mb-3">อยู่ระหว่างรอการอนุมัติ</p>
                        <p className="mb-3">การเพิ่มข้อมูลไม่สำเร็จ</p>
                        <p className="mb-3">การเพิ่มข้อมูลถูกยกเลิก</p>
                    </div>
                    <div className="text-right text-lg ">
                        <p className="mb-4"><b>{data.length}</b></p>
                        <p className="mb-3">{successData}</p>
                        <p className="mb-3">{waitData}</p>
                        <p className="mb-3">{refuseData}</p>
                        <p className="mb-3">{cancelData}</p>
                    </div>
                    <div className="col-span-2 text-center text-lg ">
                        <p className="mb-4"><b>รายการ</b></p>
                        <p className="mb-3">รายการ</p>
                        <p className="mb-3">รายการ</p>
                        <p className="mb-3">รายการ</p>
                        <p className="mb-3">รายการ</p>
                    </div>
                </div>
            </div>
            <div className="mx-3 mb-2">
                <div className="flex justify-between mb-4">
                    <div className="ml-10 pl-1 text-start text-xl">ปริมาณข้อมูลแหล่งน้ำ</div>
                    <div className="mt-1 mr-5 flex items-center">
                        <span className="mr-1 ml-1">
                            จำนวนข้อมูลในแต่ละเดือน
                        </span>
                        <Form.Select
                            size="sm"
                            style={{ maxWidth: "31%" }}
                            value={selectedYear}
                            onChange={handleYearChange}
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </Form.Select>

                    </div>
                </div>
                <BarChart
                    series={[
                        {
                            data: monthlyData,
                            color: 'rgba(0, 150, 255, 0.2)',
                            explanation: 'Monthly amounts of water source information',
                        }
                    ]}
                    height={245}
                    xAxis={[{
                        data: monthLabels,
                        scaleType: 'band'
                    }]}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                />
            </div>
        </div>
    );
}