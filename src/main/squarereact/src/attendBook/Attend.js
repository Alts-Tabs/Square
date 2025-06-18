import React, { useEffect, useRef, useState } from 'react';
import './attend.css';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import { attendanceChartOptions  } from './attendanceChartOptions';

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

    // console.log("userInfo:", userInfo);
    // console.log('현 수업 currentClass:', currentClass);


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
        if (!userInfo?.userId) return;

        const savedNumber = localStorage.getItem(`attendanceNumber_${userInfo.userId}`);
        if (savedNumber) {
            setRandomNumber(Number(savedNumber));
            setAttending(true);
        }
    }, [userInfo?.userId]); // userInfo가 로딩된 후 실행되도록


    // 2. 출석 시작 / 종료 요청
    const [timetableAttendIdx, setTimetableAttendIdx] = useState();
    useEffect(() => {
        if (!userInfo?.userId) return;
    
        // 출석 활성 여부 확인
        axios.get('/student/attendance-active', { withCredentials: true })
        .then(res => {
                console.log("출석 활성 여부:",res);
            if(res.data !== "") { // !== null이 아니었음...
                setTimetableAttendIdx(res.data);
                setAttending(true);
            } else {
                setTimetableAttendIdx();
                setAttending(false);
            }
        })
        .catch(err => {
            console.error("출석 활성 상태 확인 실패:", err);
            setAttending(false);
        });
    }, [userInfo]);

    // 지난 출석 기록 최신화 함수(API 부르고 프론트 값 포맷)
    const fetchAttendanceSummary = async () => {
        if (!currentClass || !currentClass.timetableId || !currentClass.classId) return;

        try {
            const response = await axios.get(
                `/public/${currentClass.timetableId}/attendance-summary`
            );
            const rawData = response.data || [];

            const groupedByAttendId = rawData.reduce((acc, curr) => {
                const key = curr.timetableAttendId;
                const dateObj = new Date(curr.attendStart);
                const hours = dateObj.getHours().toString().padStart(2, '0');
                const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                const dayOfWeek = dayNames[dateObj.getDay()];
                const date = curr.attendStart.split('T')[0];

                if (!acc[key]) {
                    acc[key] = {
                        timetableAttendId: curr.timetableAttendId,
                        date: date,
                        startTime: `${hours}:${minutes}`,
                        dayOfWeek: dayOfWeek,
                        statusSummary: [
                            { status: 'PRESENT', count: 0 },
                            { status: 'LATE', count: 0 },
                            { status: 'ABSENT', count: 0 }
                        ]
                    };
                }

                const target = acc[key].statusSummary.find(s => s.status === curr.status);
                if (target) {
                    target.count += curr.count;
                }

                return acc;
            }, {});

            const convertedData = Object.values(groupedByAttendId);
            setAttendanceSummaries(convertedData);
        } catch (error) {
            console.error('출석 요약을 불러오는 중 오류 발생:', error);
        }
    };


    const handleAttendanceClick = async () => {
    if (!userInfo?.userId || !currentClass?.classId) return;

    try {
        if (!attending) {
            // 출석 시작 요청
            const response = await axios.post(`/th/attendance-start`, {
                withCredentials: true
            });

            const { code } = response.data;
            setRandomNumber(code);
            setTimetableAttendIdx(response.data.idx); // 현재 출석 search 값(timetableAttend PK)
            setAttending(true);
            localStorage.setItem(`attendanceNumber_${userInfo.userId}`, code.toString());
        } else {
            // 출석 종료 요청 
            await axios.post(`/th/${timetableAttendIdx}/attendance-end`, {
                withCredentials: true
            });

            // 출석 종료 후 우측에 지난 출석 실시간 추가 - 출석 요약 신규 부르기
            await fetchAttendanceSummary();

            setAttending(false);
            setAttendanceEnded(true);
            setRandomNumber(null);
            setTimetableAttendIdx(null);
            localStorage.removeItem(`attendanceNumber_${userInfo.userId}`);
        }
        } catch (err) {
            console.error('출석 시작/종료 중 오류 발생:', err);
        }
    };

    
    // 출석 취소 ================================================================
    const handleCancelAttendance = async () => {
    if (!timetableAttendIdx) {
        console.warn("취소할 출석이 없습니다.");
        return;
    }

    try {
        await axios.post(`/th/${timetableAttendIdx}/attendance-cancel`, null, {
            withCredentials: true
        });

        setAttending(false);
        setAttendanceEnded(false);
        setRandomNumber(null);
        setTimetableAttendIdx(null);
        localStorage.removeItem(`attendanceNumber_${userInfo.userId}`);

        alert("출석이 성공적으로 취소되었습니다.");
        } catch (err) {
            console.error("출석 취소 중 오류 발생:", err);
            alert("출석 취소에 실패했습니다.");
        }
    };


    // 지난 출석 ===========================================================================
    const [attendanceSummaries, setAttendanceSummaries] = useState([]);
    
    useEffect(() => {
        fetchAttendanceSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentClass]);

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

                        {/* ▶️ 출석 시작 & 출석 종료 버튼 */}
                        {!attendanceEnded ? (
                        <>
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
                    {/* 우리 반 누적 출석률 ================================================= */}
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

                    {/* 📜 지난 출석 ============================================================= */}
                    <span className='attendTitle'> 지난 출석 </span>
                    <div className='historyAttend'>
                        {/* 반복 처리 리스트 */}
                        {Array.isArray(attendanceSummaries) && attendanceSummaries.length > 0 ? (
                        attendanceSummaries.map((summary, index) => (
                            
                        <div className='historyList' key={index}>
                            <div>
                                <span style={{ fontSize: '23px', color: '#2E5077', fontWeight: '700', display: 'inline-block', marginRight: '20px' }}>
                                    {summary.date} ({summary.dayOfWeek})
                                </span>

                                {summary.statusSummary?.map((statusObj) => (
                                <span key={statusObj.status} style={{ display: 'inline-block', marginRight: '10px' }}>
                                {statusObj.status === 'PRESENT' && (
                                    <>
                                    <i className="bi bi-circle-fill" style={{ color: '#79D7BE' }}></i>
                                    <span className='historyCount'> 출석수 {statusObj.count}</span>
                                    </>
                                )}
                                {statusObj.status === 'LATE' && (
                                    <>
                                    <i className="bi bi-triangle-fill" style={{ color: '#FFB83C' }}></i>
                                    <span className='historyCount'> 지각수 {statusObj.count}</span>
                                    </>
                                )}
                                {statusObj.status === 'ABSENT' && (
                                    <>
                                    <i className="bi bi-x-lg" style={{ color: '#D85858' }}></i>
                                    <span className='historyCount'> 결석수 {statusObj.count}</span>
                                    </>
                                )}
                                </span>
                            ))}
                            </div>

                            {/* 출석 상세 등록 링크 ===================== */}
                            <Link to={`attend-history/${summary.timetableAttendId}`}>
                                <i className="bi bi-chevron-right"></i>
                            </Link>
                        </div>

                        ))
                        ) : (
                        <p>출석 기록이 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
    );
};  

export default Attend;