import React, { useEffect, useRef, useState } from 'react';
import './attend.css';
import './attendStu.css';
import { connectSocket, onMessage, sendMessage } from '../websocket/socket';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import { attendanceChartOptions  } from './attendanceChartOptions';

const AttendStu = () => {
    const { acaId } = useParams();
    const [isEditable, setIsEditable] = useState(false);
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

    // WebSocket 연결 및 출석 시작 신호 처리
    useEffect(() => {
        const socket = connectSocket();

        onMessage((data) => {
            if (data.type === 'start') {
                setIsEditable(true); // 출석 입력창 활성화
            }
        });

        return () => socket.close();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage({ type: 'submit', studentName: '홍길동', code: e.target.value });
            e.target.value = '';
        }
    };


    // 출석한 학생 별 체크 표시 (테스트 중) ===========================================
    const [checkedStudents, setCheckedStudents] = useState([]);

    // 학생 목록 상태 추가
    const [students, setStudents] = useState([]);

    const fetchStudentsInClass = () => {
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
    }, [acaId]); // acaId가 변경될 때마다 다시 호출
    

    // 당일 날짜 출력
    const getTodayDate = () => {
        const today = new Date();
        const year = String(today.getFullYear()).slice(2);
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        return `${year}.${month}.${date} 출석`;
    };

    // (임시) 이전 출석 History
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
                <span className='attendTitle'> 오늘의 출석 </span>

                <div className='todayAttendTitle'>
                    <span> 지금 수업은 </span>
                    <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '800' }}>
                        (수업 시간표)
                    </span>
                    <span> 입니다. </span><br />
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
                <span className='attendTitle'> 우리 반 누적 출석률 </span>
                <div className='stackAttend'>
                    <div className='attendGraph' ref={chartRef}></div>

                    <div className='attendClass'>
                        <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>우리 반 누적 출석률은</span> &nbsp;
                        <span style={{ fontSize: '25px', color: '#79D7BE', fontWeight: '800' }}>(수치)%</span> &nbsp;
                        <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>!</span>

                        <div className="attenderWrapper">
                            <div className='attender'>
                                <span className='attenderTitle'> 이번 달 출석왕 </span><br />
                                <span className='attenderName'> (학생명) </span>
                            </div>
                            <div className='attender'>
                                <span className='attenderTitle'> 이번 달 분발왕 </span><br />
                                <span className='attenderName'> (학생명) </span>
                            </div>
                        </div>
                    </div>
                </div>

                <span className='attendTitle'> 지난 출석 </span>
                <div className='historyAttend'>
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AttendStu;
