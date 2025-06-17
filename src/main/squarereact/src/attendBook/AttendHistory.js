import React, { useEffect, useState } from 'react';
import './attend.css';
import './attendHistory.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AttendHistory = () => {
    const [studentStatuses, setStudentStatuses] = useState([]);
    const { timetableAttendIdx } = useParams();
    const [memoText, setMemoText] = useState('');

    const [date, setDate] = useState('');
    const formatDateToKorean = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
    };

    const presentCount = studentStatuses.filter(s => s.status === "PRESENT").length;
    const lateCount = studentStatuses.filter(s => s.status === "LATE").length;
    const absentCount = studentStatuses.filter(s => s.status === "ABSENT").length;

    // console.log("전달받은 출석 상태들:", { present, late, absent });


    // 출석 기록 백엔드에서 가져오기 ===============================================================
    useEffect(() => {
    axios.get(`/public/${timetableAttendIdx}/attendance-history`)
        .then(res => {
        const updatedStatuses = res.data.map(item => ({
            attendanceId: item.attendanceId,
            name: item.studentName,
            status: item.status,
            memo: item.memo,
            verifiedAt: item.verifiedAt
        }));

        setStudentStatuses(updatedStatuses);

        // 날짜 세팅: PRESENT인 항목에서 verifiedAt 날짜 추출
        const presentVerified = updatedStatuses.find(item => item.status === "PRESENT")?.verifiedAt;
        if (presentVerified) {
            const dateOnly = presentVerified.split('T')[0]; // yyyy-MM-dd 형태 추출
            setDate(dateOnly);
        }
        })
        .catch(err => {
        console.error("출석 이력 불러오기 실패:", err);
        });
    }, [timetableAttendIdx]); // timetableAttendIdx가 바뀔 때만 실행


    // 출석 아이콘 클릭 핸들러 ====================================================================
    const handleStatusChange = (index, newStatus) => {
        const updated = [...studentStatuses];
        updated[index].status = newStatus;
        console.log(updated[index]);
        setStudentStatuses(updated);
    };


    // 출결 기록 & 메모 수정 =============================================================================
    const handleSaveStatus = (index) => {
        const student = studentStatuses[index];

        const updates = {
            attendanceId: student.attendanceId,
            status: student.status,
            memo: student.memo || memoText  // null이면 빈 문자열로 처리
        };

        axios.put('/th/attendance-history', updates, {withCredentials: true})
            .then(() => {
                alert('출석 정보가 수정되었습니다.');
            })
            .catch(err => {
                console.error('출석 정보 수정 실패:', err);
                alert('오류 발생: 출석 정보 저장 실패');
            });
    };

    const [selectedStudentIndex, setSelectedStudentIndex] = useState(null); // 선택 값
    const handleSaveMemo = () => {
        if(selectedStudentIndex === null) {
            alert("학생을 먼저 선택");
            return;
        }

        const updated = [...studentStatuses];
        updated[selectedStudentIndex].memo = memoText;
        setStudentStatuses(updated);
    };

    // <이전 기능에 필요한 요소 (페이지 로드 시 사용자 정보 요청) =====================================
    const navi = useNavigate();
    const [userInfo, setUserInfo] = useState({name: '', role: '', username: '', acaId: '', userId: ''});
    useEffect(() => {
        axios.get("/public/user", {withCredentials: true})
            .then(res => {
                const {name, role, username, acaId, userId} = res.data;
                setUserInfo({name, role, username, acaId, userId});
            }).catch(() => { // 인증 실패 - 로그인 페이지로
                navi("/login");
            });
    }, [navi]);


    return (
        <div className='attendContainer'>

            <div className='leftContainer2'>
                {/* 출석부 편집 ================================================================== */}
                <span className='attendTitle'> {formatDateToKorean(date)} &nbsp;출석부 </span>

                {/* 이전으로 돌아가기 */}
                <div className='attendbookHeader'>
                    <Link to={`/main/attend/${userInfo.acaId}`}>
                        <i className="bi bi-chevron-left"></i>
                        <span>이전</span>
                    </Link>
                </div>

                <div className='attendbookBody'>
                <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>
                    총 인원 {presentCount + lateCount + absentCount}명
                </span>
                <br />

                <span className='attendIcons'>
                    <i className="bi bi-circle-fill" style={{ color: '#79D7BE' }}></i>
                    <span className='historyCount2'> 출석 {presentCount}명 </span>
                </span>
                <span className='attendIcons'>
                    <i className="bi bi-triangle-fill" style={{ color: '#FFB83C' }}></i>
                    <span className='historyCount2'> 지각 {lateCount}명 </span>
                </span>
                <span className='attendIcons'>
                    <i className="bi bi-x-lg" style={{ color: '#D85858' }}></i>
                    <span className='historyCount2'> 결석 {absentCount}명 </span>
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
                                    <td style={{
                                      backgroundColor: selectedStudentIndex === index ? '#f0f8ff' : 'transparent',
                                      cursor: 'pointer'
                                    }} 
                                    onClick={() => {
                                        setSelectedStudentIndex(index);
                                        setMemoText(student.memo || '');
                                    }}> {student.name} </td>
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
                                    <button onClick={() => handleSaveStatus(index)}>수정</button>
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
                    <span onClick={handleSaveMemo}>
                        임시 저장
                    </span>
                </div>

                <div className='memoBody'>
                    <textarea
                        placeholder="메모 작성 후 저장 버튼을 눌러주세요."
                        value={memoText}
                        onChange={e => setMemoText(e.target.value)}
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default AttendHistory;