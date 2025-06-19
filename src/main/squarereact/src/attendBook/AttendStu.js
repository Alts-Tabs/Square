import React, { useEffect, useRef, useState } from 'react';
import './attend.css';
import './attendStu.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import { attendanceChartOptions } from './attendanceChartOptions';

const AttendStu = () => {
    const [attendanceRate, setAttendanceRate] = useState(0); // 출석률(%)
    const [attendanceSummaryStats, setAttendanceSummaryStats] = useState({
        present: 0,
        late: 0,
        absent: 0,
    });
    const [isEditable, setIsEditable] = useState(false);
    // const [checkedStudents, setCheckedStudents] = useState([]);  // 출석 완료 학생 리스트
    
    const chartRef = useRef(null);

    // 누적 출석 차트
    useEffect(() => {
        if (chartRef.current) {
            const options = attendanceChartOptions(attendanceSummaryStats);
            const chart = new ApexCharts(chartRef.current, options);
            chart.render();

            // 언마운트 시 chart 파괴
            return () => chart.destroy();
        } 
    }, [attendanceRate, attendanceSummaryStats]);


    // 현재 수업 출력 ============================================================
    const location = useLocation();
    const passedUserInfo = location.state?.userInfo; // Main.js의 state에서 받은 userInfo
    
    const [userInfo, setUserInfo] = useState(() => { // userInfo 상태 정의
        const stored = localStorage.getItem('userInfo');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => { // 새로 받아온 userInfo가 있으면 localStorage에 저장
        if (passedUserInfo) {
            localStorage.setItem('userInfo', JSON.stringify(passedUserInfo));
            setUserInfo(passedUserInfo);
        }
    }, [passedUserInfo]);


    const [currentClass, setCurrentClass] = useState(null);

    useEffect(() => { 
        if (!userInfo?.userId) return;

        // 로그인 상태의 강사 = 시간표 수업일 시 수업명 출력
        axios.get('/public/current-class', {
            withCredentials: true
        }).then(res => {
            if (res.data) {
                setCurrentClass(res.data);
                // console.log(res.data);
            } else {
                setCurrentClass(null);
                // console.log(res.data);
            }
        }).catch(err => {
            console.error('현재 수업 정보를 불러오는 중 오류 발생:', err);
        });
    }, [userInfo]);

    // 출석왕 분발왕 구하기
    const [king, setKing] = useState(null);
    const fetchAttendRanking = async () => {
        try {
            const timetableId = currentClass.timetableId;
            const res = await axios.get(`/student/${timetableId}/attendance-ranking`, {withCredentials: true});
            // console.log(res.data);
            setKing(res.data);
        } catch(err) {
            alert("랭킹 구하기 실패");
        }
    }

    const [attendanceSummaries, setAttendanceSummaries] = useState([]);
        
        useEffect(() => {
            if(!currentClass) return;
            fetchAttendanceSummary();
            fetchAttendRanking();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [currentClass]);

    // 지난 출석 기록 최신화 함수(API 부르고 프론트 값 포맷) - 출석률 계산 추가
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

            // 출석률 계산 + 누적 상태
            let total = 0, present = 0, late = 0, absent = 0;

            rawData.forEach((entry) => {
                total += entry.count;
                if (entry.status === 'PRESENT') {
                    present += entry.count;
                } else if (entry.status === 'LATE') {
                    late += entry.count;
                } else if (entry.status === 'ABSENT') {
                    absent += entry.count;
                }
            });

            const rate = total > 0 ? Math.round((present / total) * 100) : 0;
            setAttendanceRate(rate);
            setAttendanceSummaryStats({present, late, absent});

        } catch (error) {
            console.error('출석 요약을 불러오는 중 오류 발생:', error);
        }
    };
    
    // 출석 입력란 활성화 여부 =========================================================
    useEffect(() => {
        if (!userInfo?.userId) return;

        // 출석 활성 여부 확인
        axios.get('/student/attendance-active', { withCredentials: true })
        .then(res => {
            if(res.data !== "") {
                setIsEditable(true); // true이면 출석창 활성화
            } else {
                setIsEditable(false);
            }
        })
        .catch(err => {
            console.error("출석 활성 상태 확인 실패:", err);
            setIsEditable(false);
        });
    }, [userInfo]);


    // 출석 코드 제출 ==================================================================
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const inputCode = parseInt(e.target.value);
            if (isNaN(inputCode)) {
                alert("숫자만 입력해주세요.");
                return;
            }

            axios.post('/student/attendance-submit', null, {
                params: {
                    submittedCode: inputCode
                },
                withCredentials: true
            })
            .then((res) => {
                if (res.data === true) {
                    alert("출석이 완료되었습니다.");
                    // setCheckedStudents(prev => [...prev, userInfo.userId]);
                    setIsEditable(false); // 출석창 비활성화
                } else {
                    alert("출석 코드가 유효하지 않습니다.");
                }
            })
            .catch(err => {
                console.error("출석 제출 실패:", err);
                const msg = err?.response?.data || "출석 처리 중 오류가 발생했습니다.";
                alert(msg);
            });
        }
    };

    // 현재 수업에 해당하는 학생 목록 출력 ============================================
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
    

    // 당일 날짜 출력
    const getTodayDate = () => {
        const today = new Date();
        const year = String(today.getFullYear()).slice(2);
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        return `${year}.${month}.${date} 출석`;
    };

    // 💚 출석한 학생 색상 변화 ===========================================================
    const [timetableAttendIdx, setTimetableAttendIdx] = useState();
    const [presentStudents, setPresentStudents] = useState([]);
    const presentUsernames = presentStudents.map((s) => s.username);

    useEffect(() => {
        if(!timetableAttendIdx) return;

        const interval = setInterval(() => {
            axios.get(`/student/${timetableAttendIdx}/student-color`)
                .then((res) => {
                    // console.log('🎯 API 응답 값:', res.data);
                    setPresentStudents(res.data); 
                })
                .catch((err) => console.error(err));
        }, 3000);

        return () => clearInterval(interval);
    }, [timetableAttendIdx]);

    useEffect(() => {
        if (!userInfo?.userId) return;

        // 출석 활성 timetableAttendIdx 가져오기
        axios.get('/student/attendance-active', { withCredentials: true })
            .then(res => {
                if (res.data !== "") {
                    setTimetableAttendIdx(res.data);
                } else {
                    setTimetableAttendIdx(); // 출석 중이 아니라면 초기화
                }
            })
            .catch(err => {
                setTimetableAttendIdx();
            });
    }, [userInfo]);

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

                <div className='todayAttendContent'>
                    <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>
                        {getTodayDate()}
                    </span>
                    <br />

                    {/* 하나의 input 필드만 상태에 따라 동적으로 변화 */}
                    <input
                        className={isEditable ? 'nowAttend' : 'waitAttend'}
                        type="text"
                        placeholder={isEditable ? '출석 진행 중' : '출석 대기 중'}
                        disabled={!isEditable}
                        onKeyDown={isEditable ? handleKeyDown : undefined}
                    />
                    <br />
                    {isEditable && (
                        <span style={{ fontSize: "17px", display: "inline-block", marginBottom: "25px" }}>
                            화면에 보이는 숫자를 입력한 후 Enter를 눌러주세요.
                        </span>
                    )}

                    <hr />

                    <div className='listWrapper'>
                        {/* 수강생 출력이 없을 때의 안내 메세지 */}
                        {students.length === 0 && (
                            <div style={{ color: '#888', marginTop: '10px' }}>
                                수업 시간이 아닙니다.
                            </div>
                        )}

                        {/* 💚 수강생 반복 출력 영역 =======================================================*/}
                        {students.map((student) => {
                            const isPresent = presentUsernames.includes(student.username);

                            return (
                                <div className='studentList' 
                                    key={student.username}
                                    style={{border: isPresent ? '1px solid #79D7BE' : '1px solid #7D8A8A'}}
                                >
                                    <div className='studentListHeader' style={{backgroundColor: isPresent ? '#79D7BE' : 'rgba(125, 138, 138, 0.25)'}}></div>
                                    <hr style={{ border: isPresent ? '1px solid #79D7BE' : '1px solid #7D8A8A' }} />
                                    <span
                                        className='attenderTitle'
                                        style={{ color: isPresent ? '#79D7BE' : '#7D8A8A' }}
                                    >
                                        {student.name}
                                    </span>
                                </div>
                            );
                        })}
                        {/* =============================================================================== */}
                    </div>
                </div>
            </div>

            <div className='rightContainer'>
                <span className='attendTitle'> 우리 반 누적 출석률 </span>
                <div className='stackAttend'>
                    <div className='attendGraph' ref={chartRef}></div>

                    <div className='attendClass'>
                        <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>우리 반 누적 출석률은</span> &nbsp;
                        <span style={{ fontSize: '25px', color: '#79D7BE', fontWeight: '800' }}>{attendanceRate}%</span> &nbsp;
                        <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>!</span>

                        <div className="attenderWrapper">
                            <div className='attender'>
                                <span className='attenderTitle'> 이번 달 출석왕 </span><br />
                                <span className='attenderName'> {king !== null ? king.attendanceKing.name : "출석왕"} </span>
                            </div>
                            <div className='attender'>
                                <span className='attenderTitle'> 이번 달 분발왕 </span><br />
                                <span className='attenderName'> {king !== null ? king.needEffortKing.name : "분발왕"} </span>
                            </div>
                        </div>
                    </div>
                </div>

                <span className='attendTitle'> 지난 출석 </span>
                <div className='historyAttend'>
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

export default AttendStu;
