import React, { useEffect, useState } from 'react';
import './classStudentsManage.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const TeachersManage = () => {
  const location = useLocation();
  const academyId = location.state?.acaId; // 소속 학원 PK

  const [teachers, setTeachers] = useState([]);
  // 강사 목록 호출
  const fetchTeachers = () => {
    if(!academyId) return;

    axios.get(`/dir/${academyId}/teacherList`, {withCredentials: true})
    .then(res => {
      setTeachers(res.data);
    }).catch(err => {
      alert("학원강사 목록 호출 실패", err);
    });
  }

  // 강사 삭제
  const handleDeleteTeacher = async (teacherId) => {
    try {
      await axios.delete(`/dir/${teacherId}/teacher`, {withCredentials: true});
      alert("삭제 성공");
      fetchTeachers();
    } catch(err) {
      alert("해당 강사 삭제 실패");
    }
  }

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academyId]);

  return (
    <div className='studentsManageWrapper'>
      <span className='attendTitle'> 멤버 관리 </span>
      <div className='student-manage-list'>
      {teachers && teachers.map((t) => (
        <div key={t.teacherId} className='student-manage-item'>
            <img src={t.userProfile} alt={t.userProfile}
             className='student-profileCircle' />
            {/* 정보 */}
            <div className='student-manage-Info'>
              <div className='student-infoTop'>
                <span>{t.name}</span>|
                <span>핸드폰: {t.phone}</span>|
                <span>이메일: {t.email}</span>
              </div>
              <div className='student-infoBottom'>
                <span>담당 과목: {t.subject}</span>
              </div>
            </div>
            
            <div className='student-manage-buttons'>
              <button className='student-deleteBtn'
               onClick={() => handleDeleteTeacher(t.teacherId)}>삭제</button>
            </div>
          </div>
      ))}
      </div>
    </div>
  );
};

export default TeachersManage;