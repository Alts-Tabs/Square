import React, { useEffect, useRef, useState } from 'react';
import './mobileAttend.css';
import './mobileAttendStu.css';
import ApexCharts from 'apexcharts';
import { attendanceChartOptions } from '../attendBook/attendanceChartOptions';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const MobileAttendStu = () => {
    const [isEditable, setIsEditable] = useState(false);
    // const [checkedStudents, setCheckedStudents] = useState([]);  // 출석 완료 학생 리스트
    const [attendanceRate, setAttendanceRate] = useState(0); // 출석률(%)
    const [attendanceSummaryStats, setAttendanceSummaryStats] = useState({
        present: 0,
        late: 0,
        absent: 0,
    });

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

    const [currentClass, setCurrentClass] = useState(null);

    useEffect(() => { 
        if (!userInfo?.userId) return;

        // 로그인 상태의 강사 = 시간표 수업일 시 수업명 출력
        axios.get('/public/current-class', {
            withCredentials: true
        }).then(res => {
            if (res.data) {
                setCurrentClass(res.data);
                console.log(res.data);
            } else {
                setCurrentClass(null);
                console.log(res.data);
            }
        }).catch(err => {
            console.error('현재 수업 정보를 불러오는 중 오류 발생:', err);
        });
    }, [userInfo]);

    useEffect(() => { // 새로 받아온 userInfo가 있으면 localStorage에 저장
        if (passedUserInfo) {
            localStorage.setItem('userInfo', JSON.stringify(passedUserInfo));
            setUserInfo(passedUserInfo);
        }
    }, [passedUserInfo]);

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
    // 지난 출석 ===========================================================================
    // const [attendanceSummaries, setAttendanceSummaries] = useState([]);
    
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
            setIsEditable(res.data); // true이면 출석창 활성화
        })
        .catch(err => {
            console.error("출석 활성 상태 확인 실패:", err);
            setIsEditable(false);
        });
    }, [userInfo]);


    // 출석 코드 제출 ==================================================================
    // 출석 코드 제출 함수 (공통 로직 분리)
function submitAttendance(inputCode) {
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

// Enter 키 눌렀을 때
const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        const inputCode = parseInt(e.target.value);
        submitAttendance(inputCode);
    }
};

// 클릭으로 출석 처리
const handleClickAttend = () => {
    const input = document.querySelector('.m-nowAttend');
    if (input && input.value) {
        const inputCode = parseInt(input.value);
        submitAttendance(inputCode);
    } else {
        alert("출석 코드를 입력해주세요.");
    }
};


    // console.log("currentClass?.timetableIdx: ", currentClass?.timetableIdx);


    // 현재 수업에 해당하는 학생 목록 출력 ============================================
    // const [students, setStudents] = useState([]); // 학생 목록 상태 추가

    // useEffect(() => {
    //     if (!userInfo?.userId) return;

    //     axios.get('/public/current-students', {
    //     withCredentials: true
    //     })
    //     .then(res => {
    //         setStudents(Array.isArray(res.data) ? res.data : []);
    //     })
    //     .catch(err => {
    //         console.error("수강생 목록 불러오기 실패:", err);
    //         setStudents([]);
    //     });
    // }, [userInfo]);
    // ===============================================================================
    

    // 당일 날짜 출력
    const getTodayDate = () => {
        const today = new Date();
        const year = String(today.getFullYear()).slice(2);
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        return `${year}.${month}.${date} 출석`;
    };

    return (
        <div className='m-attend-stu-container'>
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
                    <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>
                        {getTodayDate()}
                    </span>
                    <br />

                    {/* 하나의 input 필드만 상태에 따라 동적으로 변화 */}
                    <input
                        className={isEditable ? 'm-nowAttend' : 'm-waitAttend'}
                        type="text"
                        placeholder={isEditable ? '출석 진행 중' : '출석 대기 중'}
                        disabled={!isEditable}
                        onKeyDown={isEditable ? handleKeyDown : undefined}
                    />
                    <br />
                    {isEditable && (
                        <span style={{ fontSize: "15px", display: "inline-block", marginBottom: "25px", cursor:'pointer' }}
                         onClick={handleClickAttend}>
                            출석하기
                        </span>
                    )}
                </div>
                <div style={{margin:'20px'}}></div>
            </div>
            {/* 우리 반 누적 출석률 =========================================== */}
            <div className='m-today-title'>
                <span className='m-attendTitle'> 우리 반 누적 출석률 </span>
            </div>

            <div className='m-stackAttend'>
                <div className='m-attendGraph' ref={chartRef}></div>

                <div className='m-attendClass'>
                    <span style={{ fontSize: '20px', color: '#2E5077', fontWeight: '700' }}>우리 반 누적 출석률은</span> &nbsp;
                    <span style={{ fontSize: '20px', color: '#79D7BE', fontWeight: '800' }}>{attendanceRate}%</span> &nbsp;
                    <span style={{ fontSize: '20px', color: '#2E5077', fontWeight: '700' }}>!</span>

                    <div className="m-attenderWrapper">
                        <div className='m-attender'>
                            <span className='m-attenderTitle'> 이번 달 출석왕 </span><br />
                            <span className='m-attenderName'> {king !== null ? king.attendanceKing.name : "출석왕"}  </span>
                        </div>
                        <div className='m-attender'>
                            <span className='m-attenderTitle'> 이번 달 분발왕 </span><br />
                            <span className='m-attenderName'> {king !== null ? king.needEffortKing.name : "분발왕"} </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MobileAttendStu;