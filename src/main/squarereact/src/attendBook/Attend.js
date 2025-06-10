import React, { useEffect, useRef, useState } from 'react';
import './attend.css';
import { Link, useParams } from 'react-router-dom';
import { connectSocket, sendMessage, onMessage } from '../websocket/socket';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import { attendanceChartOptions  } from './attendanceChartOptions';

const Attend = () => {
    const { acaId } = useParams();
    const chartRef = useRef(null);

    // 누적 출석 차트
    useEffect(() => {
        if (chartRef.current) {
        const chart = new ApexCharts(chartRef.current, attendanceChartOptions );
        chart.render();

        // 언마운트 시 chart 파괴
        return () => chart.destroy();
        }
    }, []);

    
    // Web Socket
    useEffect(() => {
    const socket = connectSocket();
    
    const handleMessage = (data) => {
        if (data.type === 'check') {
            console.log(`${data.studentName} submitted code ${data.code}`);
            setCheckedStudents(prev => {
                if (!prev.includes(data.studentName)) {
                    return [...prev, data.studentName];
                }
                return prev;
            });
        } else if (data.type === 'start') {
            setRandomNumber(data.code); // 출석 숫자 표시
        } else if (data.type === 'stop') {
            setRandomNumber(null);
            setAttendanceEnded(true);
        }
    };
    
        onMessage(handleMessage);
        
        return () => socket.close();
    }, []);

    

    // 출석한 학생 별 체크 표시 (테스트 중) ===========================================
    const [checkedStudents, setCheckedStudents] = useState([]);

    // 학생 목록 상태 추가
    const [students, setStudents] = useState([]);

    // 학생 목록 호출 (ClassStudentsManage와 동일한 로직)
    const fetchStudentsInClass = () => {
        // acaId가 없을 경우 API 호출을 하지 않습니다.
        if (!acaId) {
            console.warn("acaId is not available, skipping student fetch.");
            return;
        }

        axios.get(`/public/${acaId}/students`, { withCredentials: true })
            .then(res => {
                setStudents(res.data);
            })
            .catch(err => {
                alert("수강생 목록을 불러오는 데 실패했습니다.", err);
            });
    };

    // acaId 변경 시 또는 컴포넌트 마운트 시 학생 목록 호출
    useEffect(() => {
        fetchStudentsInClass();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acaId]); // acaId가 변경될 때마다 다시 호출
    // ====================================================================
    
    // 당일 출석 날짜 출력
    const getTodayDate = () => {
        const today = new Date();
        const year = String(today.getFullYear()).slice(2); // '25'
        const month = String(today.getMonth() + 1).padStart(2, '0'); // '05'
        const date = String(today.getDate()).padStart(2, '0'); // '19'
        return `${year}.${month}.${date} 출석`;
    };

    // 출석 숫자 랜덤 발생 & 삭제 
    const [attending, setAttending] = useState(false);
    const [attendanceEnded, setAttendanceEnded] = useState(false); 
    const [randomNumber, setRandomNumber] = useState(null);   

    // 출석 숫자 생성/중단 요청
    const handleAttendanceClick = () => {
        if (!attending) {
            setAttending(true);
            sendMessage({ type: 'start' });
        } else {
            setAttending(false);
            sendMessage({ type: 'stop' });
        }
    };


    // 출석 취소 기능
    const handleCancelAttendance = () => {
        setAttending(false);
        setRandomNumber(null);
        // 출석 취소 시 참여한 학생 리스트도 초기화할 수 있음 (선택사항)
        setCheckedStudents([]);
        // sendMessage({ type: 'cancel' }); // 백엔드나 학생 쪽에 알림 보내고 싶다면 사용
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
                    {/* 지금 수업은 ~입니다. */}
                    <div className='todayAttendTitle'>
                        <span> 지금 수업은 </span>
                        <span style={{fontSize:'25px', color:'#2E5077', fontWeight:'800'}}> 
                            (수업 시간표) 
                        </span>
                        <span> 입니다. </span> <br/>
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
                            {/* 수강생 반복 출력 영역 =======================================*/}
                            {students.map((student) => (
                                <div className='studentList' key={student.studentId}>
                                    <div className='studentProfileCircle'>
                                        {checkedStudents.includes(student.name) && (
                                            <i className="bi bi-check-circle-fill checkIcon"></i>
                                        )}
                                    </div> {/* 학생 프로필 이미지란 (또는 아바타) */}
                                    <hr style={{ border: '1px solid #7D8A8A' }} />
                                    <span className='attenderTitle'> {student.name} </span>
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