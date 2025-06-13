import React, { useEffect, useRef, useState } from 'react';
import './attend.css';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import { attendanceChartOptions  } from './attendanceChartOptions';
import { io } from 'socket.io-client';

const Attend = () => {
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

    
    // Web Socket 같은 class_id 유저끼리 방 입장 ====================================
    const [currentClass, setCurrentClass] = useState(null);  
    const [socket, setSocket] = useState(null);
    
    useEffect(() => {
        if (!currentClass || !currentClass.classId) return;

        const newSocket = io('http://localhost:8090');
        setSocket(newSocket);

        newSocket.emit('join-class', currentClass.classId);

        newSocket.on('start', ({ code }) => {
            setRandomNumber(code);
            setAttending(true);
            setAttendanceEnded(false);
        });

        newSocket.on('stop', () => {
            setRandomNumber(null);
            setAttending(false);
            setAttendanceEnded(true);
        });

        newSocket.on('check', ({ studentName }) => {
            // handle check
        });

        return () => {
            newSocket.disconnect();
        };
    }, [currentClass]);
    

    // 현재 수업 출력 ============================================================
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

    console.log("userInfo:", userInfo);
    console.log('현 수업 currentClass:', currentClass);


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
    

    // 출석 숫자 랜덤 발생 & 삭제 ===================================================
    const [attending, setAttending] = useState(false);
    const [attendanceEnded, setAttendanceEnded] = useState(false); 
    const [randomNumber, setRandomNumber] = useState(null);   

    // 1. 컴포넌트 마운트 시 localStorage에 저장된 출석번호 복원
    useEffect(() => {
        const savedNumber = localStorage.getItem('attendanceNumber');
        if (savedNumber) {
            setRandomNumber(Number(savedNumber));
            setAttending(true); // 저장된 번호가 있다는 건 출석 중이라는 의미
        }
    }, []);

    // 2. 출석 시작 / 종료 요청
    const handleAttendanceClick = () => {
        if (!socket || !currentClass?.classId) return;

        if (!attending) {
            socket.emit('start-attendance', currentClass.classId);
        } else {
            socket.emit('stop-attendance', currentClass.classId);
        }
    };

    // 3. 출석 취소 기능
    const handleCancelAttendance = () => {
        setAttending(false);
        setRandomNumber(null);
        localStorage.removeItem('attendanceNumber');
        setCheckedStudents([]);
    };


    // 지난 출석 날짜 출력 (임시) ================================================
    const attendList = [
        {
            dateText: '25.05.09 금요일 출석',
            dateOnly: '25.05.09 금요일',
            present: 12,
            late: 2,
            absent: 1,
        },
        {
            dateText: '25.05.08 목요일 출석',
            dateOnly: '25.05.08 목요일',
            present: 13,
            late: 1,
            absent: 1,
        }
    ];


    return (
            <div className='attendContainer'>
                
                <div className='leftContainer'>
                    {/* 오늘의 출석 ==================================================== */}
                    <span className='attendTitle'> 오늘의 출석 </span>
                    {/* 현재 로그인 된 강사의 수업 출력 */}
                    <div className='todayAttendTitle'>
                    {currentClass ? (
                        <>
                        <span> 지금은&nbsp; </span>
                        <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '800' }}>
                            {currentClass.className}
                        </span>
                        <span> &nbsp;입니다. </span>
                        </>
                    ) : (
                        <span style={{ fontSize: '25px', color: '#7D8A8A', fontWeight: '800' }}>
                            지금은 진행 중인 수업이 없습니다.
                        </span>
                    )}
                    </div>


                    {/* 출석 버튼 이벤트 */}
                    <div className='todayAttendContent'>
                        <span style={{fontSize:'25px', color:'#2E5077', fontWeight:'700'}}>
                            {getTodayDate()}
                        </span>
                        <br />

                        {/* 출석 시작 & 출석 종료 버튼 */}
                        {!attendanceEnded ? (
                        <>
                            {/* 출석 중일 때만 랜덤 숫자 출력 */}
                            {attending && randomNumber && (
                                <div style={{
                                    fontSize: '60px',
                                    fontWeight: 'bold',
                                    color: '#2E5077',
                                }}>
                                    {randomNumber}
                                </div>
                            )}

                            <button
                                onClick={handleAttendanceClick}
                                className={`attendButton ${attending ? 'end' : ''}`}
                            >
                                {attending ? '출석 종료' : '출석 시작'}
                            </button>


                            {/* 출석 취소 텍스트 */}
                            {attending && (
                                <div
                                    onClick={handleCancelAttendance}
                                    style={{
                                        cursor: 'pointer',
                                        color: 'rgba(125,138,138,0.7)',
                                        fontWeight: '600',
                                        textDecoration: 'underline',
                                    }}
                                >
                                    출석 취소
                                </div>
                            )}
                            </>
                            ) : (
                            <div
                                style={{
                                fontSize: '50px',
                                fontWeight: '700',
                                color: 'rgba(125,138,138,0.5)',
                                marginTop: '20px',
                                marginBottom: '45px',
                                height: '65px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                }}
                            >
                                출석 종료
                            </div>
                        )}
                        <hr style={{marginBottom:'35px'}}/>
                        
                        <div className='listWrapper'>
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


                <div className='rightContainer'>
                    {/* 우리 반 누적 출석률 =========================================== */}
                    <span className='attendTitle'> 우리 반 누적 출석률 </span>
                    <div className='stackAttend'>
                        {/* 원형(도넛) 그래프 */}
                        <div className='attendGraph' ref={chartRef}></div>

                        {/* 반 누적 % */}
                        <div className='attendClass'>
                            <span style={{fontSize:'25px', color:'#2E5077', fontWeight:'700'}}> 우리 반 누적 출석률은 </span> &nbsp;        
                            <span style={{fontSize:'25px', color:'#79D7BE', fontWeight:'800'}}> (수치)% </span> &nbsp;                               
                            <span style={{fontSize:'25px', color:'#2E5077', fontWeight:'700'}}> ! </span>
                            
                            <div className="attenderWrapper">
                                <div className='attender'>
                                    <span className='attenderTitle'> 이번 달 출석왕 </span> <br />
                                    <span className='attenderName'> (학생명) </span>
                                </div>

                                <div className='attender'>
                                    <span className='attenderTitle'> 이번 달 분발왕 </span> <br />
                                    <span className='attenderName'> (학생명) </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 지난 출석 ==================================================== */}
                    <span className='attendTitle'> 지난 출석 </span>
                    <div className='historyAttend'>
                        {/* 반복 처리 리스트 */}
                        {attendList.map((attend, index) => (
                        <div className='historyList' key={index}>
                        <div>
                            <span style={{ fontSize: '23px', color: '#2E5077', fontWeight: '700', display: 'inline-block', marginRight: '20px' }}>
                            ({attend.dateText})
                            </span>

                            <span style={{ display: 'inline-block', marginRight: '10px' }}>
                            <i className="bi bi-circle-fill" style={{ color: '#79D7BE' }}></i>
                            <span className='historyCount'> ({attend.present}) </span>
                            </span>

                            <span style={{ display: 'inline-block', marginRight: '10px' }}>
                            <i className="bi bi-triangle-fill" style={{ color: '#FFB83C' }}></i>
                            <span className='historyCount'> ({attend.late}) </span>
                            </span>
                            
                            <span style={{ display: 'inline-block' }}>
                            <i className="bi bi-x-lg" style={{ color: '#D85858' }}></i>
                            <span className='historyCount'> ({attend.absent}) </span>
                            </span>
                        </div>

                        <Link
                            to="attend-history"
                            state={{
                            date: attend.dateOnly,
                            present: attend.present,
                            late: attend.late,
                            absent: attend.absent
                            }}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </Link>
                        </div>
                    ))}
                    </div>
                </div>
                
            </div>
    );
};  

export default Attend;