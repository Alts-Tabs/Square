import React, { useEffect, useRef, useState } from 'react';
import './mobileAttend.css';
import ApexCharts from 'apexcharts';
import { attendanceChartOptions } from '../attendBook/attendanceChartOptions';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const MobileAttend = () => {
    const chartRef = useRef(null);
    
        // 누적 출석 차트 ===========================================================
        useEffect(() => {
            if (chartRef.current) {
                const chart = new ApexCharts(chartRef.current, attendanceChartOptions );
                chart.render();
    
                // 언마운트 시 chart 파괴
                return () => chart.destroy();
            } 
        }, []);

    // 현재 수업 출력 ============================================================
    const [currentClass, setCurrentClass] = useState(null);  
    const location = useLocation();
    const passedUserInfo = location.state?.userInfo; // Main.js의 state에서 받은 userInfo
    
    const [userInfo, setUserInfo] = useState(() => { // userInfo 상태 정의
        const stored = localStorage.getItem('userInfo');
        return passedUserInfo || (stored ? JSON.parse(stored) : null);
    });

    useEffect(() => { // 새로 받아온 userInfo가 있으면 localStorage에 저장
        if (passedUserInfo) {
            localStorage.setItem('userInfo', JSON.stringify(passedUserInfo));
            setUserInfo(passedUserInfo);
        }
    }, [passedUserInfo]);    

    useEffect(() => { // 로그인 상태의 강사 = 시간표 수업일 시 수업명 출력
        if (!userInfo?.userId) return;

        axios.get('/public/current-class', {
            withCredentials: true
        }).then(res => {
            if (res.data) {
                setCurrentClass(res.data);
            } else {
                setCurrentClass(null);
            }
        }).catch(err => {
            console.error('현재 수업 정보를 불러오는 중 오류 발생:', err);
        });
    }, [userInfo]);

    //console.log("userInfo:", userInfo);
    //console.log('현 수업 currentClass:', currentClass);

    // 현재 수업에 해당하는 학생 목록 출력 ============================================
    const [checkedStudents, setCheckedStudents] = useState([]);
    const [students, setStudents] = useState([]); // 학생 목록 상태 추가

    useEffect(() => {
        if (!userInfo?.userId) return;

        axios.get('/public/current-students', {
        withCredentials: true
        })
        .then(res => {
            setStudents(Array.isArray(res.data) ? res.data : []);
        })
        .catch(err => {
            console.error("수강생 목록 불러오기 실패:", err);
            setStudents([]);
        });
    }, [userInfo]);
    // ===============================================================================

    // 당일 출석 날짜 출력
    const getTodayDate = () => {
        const today = new Date();
        const year = String(today.getFullYear()).slice(2); // '25'
        const month = String(today.getMonth() + 1).padStart(2, '0'); // '05'
        const date = String(today.getDate()).padStart(2, '0'); // '19'
        return `${year}.${month}.${date} 출석`;
    };


    return (
        <div className='m-attend-container'>
            {/* 우리 반 누적 출석률 =========================================== */}
            <div className='m-today-title'>
                <span className='m-attendTitle'> 우리 반 누적 출석률 </span>
            </div>
            <div className='m-stackAttend'>
                {/* 원형(도넛) 그래프 */}
                <div className='m-attendGraph' ref={chartRef}></div>

                {/* 반 누적 % */}
                <div className='m-attendClass'>
                    <span style={{fontSize:'20px', color:'#2E5077', fontWeight:'700'}}> 우리 반 누적 출석률은 </span> &nbsp;        
                    <span style={{fontSize:'20px', color:'#79D7BE', fontWeight:'800'}}> (수치)% </span> &nbsp;                               
                    <span style={{fontSize:'20px', color:'#2E5077', fontWeight:'700'}}> ! </span>
                    
                    <div className="m-attenderWrapper">
                        <div className='m-attender'>
                            <span className='m-attenderTitle'> 이번 달 출석왕 </span> <br />
                            <span className='m-attenderName'> (학생명) </span>
                        </div>

                        <div className='m-attender'>
                            <span className='m-attenderTitle'> 이번 달 분발왕 </span> <br />
                            <span className='m-attenderName'> (학생명) </span>
                        </div>
                    </div>
                </div>
            </div>            

            <div className='m-todayAttend'>
                <div className='m-today-title'>
                    <span className='m-attendTitle'> 오늘의 출석 </span>
                </div>

                {/* 현재 로그인 된 강사의 수업 출력 */}
                <div className='m-todayAttendTitle'>
                {currentClass ? (
                    <>
                    <span> 지금은&nbsp; </span>
                    <span style={{ fontSize: '20px', color: '#2E5077', fontWeight: '800' }}>
                        {currentClass.className}
                    </span>
                    <span> &nbsp;입니다. </span>
                    </>
                ) : (
                    <span style={{ fontSize: '20px', color: '#7D8A8A', fontWeight: '800' }}>
                        지금은 진행 중인 수업이 없습니다.
                    </span>
                )}
                </div>
              <div className='m-todayAttendContent'> 
                <div className='m-listWrapper'>
                    {/* 수강생 출력이 없을 때의 안내 메세지 */}
                    {students.length === 0 && (
                        <div style={{ color: '#888', marginTop: '10px' }}>
                            수업 시간이 아닙니다.
                        </div>
                    )}

                    {/* 수강생 반복 출력 영역 =======================================*/}
                    {students.map((student) => (
                        <div className='studentList' key={student.username}>
                            <div className='studentProfileCircle'>
                                {checkedStudents.includes(student.name) && (
                                    <i className="bi bi-check-circle-fill checkIcon"></i>
                                )}
                            </div>
                            <hr style={{ border: '1px solid #7D8A8A' }} />
                            <span className='attenderTitle'>{student.name}</span>
                        </div>
                    ))}
                    {/* ============================================================ */}
                </div>
              </div>
            </div>

        </div>
    );
};

export default MobileAttend;