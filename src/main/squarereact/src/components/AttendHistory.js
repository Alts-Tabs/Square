import React, { useState } from 'react';
import './attend.css';
import './attendHistory.css';
import { Link, useLocation } from 'react-router-dom';

const AttendHistory = () => {
    // 해당 출석 날짜 Title
    const location = useLocation();
    const { date, present, late, absent } = location.state || {};


    // 출석 상태 관리 (임시) =======================================================
    const [studentStatuses, setStudentStatuses] = useState([
    {
        name: "학생1",
        status: "ABSENT"
    },
    {
        name: "학생2",
        status: "ABSENT"
    }
    // 여러 학생 가능
    ]);

    // 출석 아이콘 클릭 핸들러 
    const handleStatusChange = (index, newStatus) => {
    const updated = [...studentStatuses];
    updated[index].status = newStatus;
    setStudentStatuses(updated);
    };


    return (
        <div className='attendContainer'>

            <div className='leftContainer2'>
                {/* 출석부 편집 ================================================================== */}
                <span className='attendTitle'>({date}) 출석부</span> {/* 해당 출석 날짜 */}

                {/* 이전으로 돌아가기 */}
                <div className='attendbookHeader'>
                <Link to="/attend">
                    <i className="bi bi-chevron-left"></i>
                    <span>이전</span>
                </Link>
                </div>

                <div className='attendbookBody'>
                <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>
                    (수업명) 총 인원 {(present + late + absent)}명
                </span>
                <br />

                <span className='attendIcons'>
                    <i className="bi bi-circle-fill" style={{ color: '#79D7BE' }}></i>
                    <span className='historyCount2'> 출석 {present}명 </span>
                </span>
                <span className='attendIcons'>
                    <i className="bi bi-triangle-fill" style={{ color: '#FFB83C' }}></i>
                    <span className='historyCount2'> 지각 {late}명 </span>
                </span>
                <span className='attendIcons'>
                    <i className="bi bi-x-lg" style={{ color: '#D85858' }}></i>
                    <span className='historyCount2'> 결석 {absent}명 </span>
                </span>
                    <br />
                    
                    <span style={{fontSize:'19px', opacity:'0.7'}}>
                        출석/지각/결석 아이콘을 누르고 저장하면 출결을 변경하실 수 있습니다.
                    </span>

                    {/* 출석부 표 */}
                    <table>
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>출석</th>
                                <th>지각</th>
                                <th>결석</th>
                                <th>수정</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentStatuses.map((student, index) => (
                                <tr key={index}>
                                <td>{student.name}</td>
                                {/* 출석 ● */}
                                <td onClick={() => handleStatusChange(index, "PRESENT")}>
                                    <i
                                    className="bi bi-circle-fill"
                                    style={{
                                        color: student.status === "PRESENT" ? '#79D7BE' : '#ccc',
                                        fontSize: '35px',
                                        cursor: 'pointer'
                                    }}
                                    ></i>
                                </td>

                                {/* 지각 ▲ */}
                                <td onClick={() => handleStatusChange(index, "LATE")}>
                                    <i
                                    className="bi bi-triangle-fill"
                                    style={{
                                        color: student.status === "LATE" ? '#FFB83C' : '#ccc',
                                        fontSize: '35px',
                                        cursor: 'pointer'
                                    }}
                                    ></i>
                                </td>

                                {/* 결석 X */}
                                <td onClick={() => handleStatusChange(index, "ABSENT")}>
                                    <i
                                    className="bi bi-x-lg"
                                    style={{
                                        color: student.status === "ABSENT" ? '#D85858' : '#ccc',
                                        fontSize: '35px',
                                        cursor: 'pointer'
                                    }}
                                    ></i>
                                </td>

                                <td>
                                    <button onClick={() => console.log(student)}> 수정 </button>
                                </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>


            <div className='rightContainer2'>
                {/* 메모 작성 ================================================================== */}
                <div className='memoHeader'>
                    <span style={{fontSize:'25px', color:'#2E5077', fontWeight:'700'}}>
                        메모 작성
                    </span>
                    <span> 
                        저장 
                    </span>
                </div>

                <div className='memoBody'>
                    <textarea placeholder="메모 작성 후 저장 버튼을 눌러주세요."></textarea>
                </div>
            </div>
        </div>
    );
};

export default AttendHistory;