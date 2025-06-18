import React, { useEffect, useState } from 'react';
import './classStudentsManage.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const StudentsManage = () => {
  const location = useLocation();
  const acaId = location.state?.acaId; // 소속 학원 PK

  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // 상세보기 선택 학생
  const [selectedClassId, setSelectedClassId] = useState('');

  // 학생 필터링
  const filterdStudents = students.filter(student => {
    if(!selectedClassId) return true;
    return student.classIds?.includes(parseInt(selectedClassId));
  });

  // 수강생 목록 호출
  const fetchAllStudents = () => {
    if(!acaId) return;

    axios.get(`/public/${acaId}/students`, {withCredentials: true,})
    .then(res => {
      setStudents(res.data);
      // setAllStudents(res.data);
    }).catch(err => {
      alert("수강생 목록 호출 실패", err);
    });
  }

  // 클래스 목록 불러오기
  const fetchClassList = () => {
    if(!acaId) return;

    axios.get(`/th/${acaId}/classes`, {withCredentials: true})
    .then(res => {setClasses(res.data)})
    .catch(err => {alert('클래스 목록 호출 실패')});
  }

  useEffect(() => {
      fetchClassList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acaId]);

  // 첫 렌더링 및 검색&필터 시점만 호출
  useEffect(() => {
    fetchAllStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteStudent = async (userId) => {
    try {
      await axios.delete(`/th/${userId}/student`, {withCredentials: true});
      alert("삭제 성공");
      fetchAllStudents();
    } catch(err) {
      alert("해당 학생 삭제 실패");
    }
  }

  return (
    <div className='studentsManageWrapper'>
      <span className='attendTitle'> 수강생 관리 </span>
      <div className='listHeader' style={{ justifyContent: 'normal' }}>
        {selectedStudent ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ cursor: 'pointer', fontWeight: 'bold', color: '#7D8A8A' }}
              onClick={() => setSelectedStudent(null)}>&lt; 이전</span>
          </div>) : (<>
          {/* 클래스 필터 */}
          <select className='classFilter' style={{ width: '14%', marginRight: '10px' }}
           value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
            <option value=''> 클래스 선택 </option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          <span className='selectFilterValue'>
            {selectedClassId ? 
              classes.find(cls => cls.id.toString() === selectedClassId)?.name ||
              '' : '전체'}
          </span>
        </>)}
      </div>

      {/* 각 학생 정보 출력 */}
      <div className='student-manage-list'>
      {selectedStudent ? (
        <div className='studentCard'>
          <img src={selectedStudent.userProfile} alt={selectedStudent.userProfile}
           className='studentPhoto' /> {/* 학생 프로필 이미지란 */}

          {/* 학생명, Role, 등록일자 */}
          <div className='nameBox'>
            <span className='studentName'> {selectedStudent.name} </span>
            <br />
            <span className='grayText'> <b> 학생👤 </b> </span>
            <span className='grayText'> <b> 등록일자 </b>&nbsp;&nbsp; ({selectedStudent.regDate}) </span>
            <hr />
          </div>
          {/* 클래스, 담당 강사, 수강 과목 */}
          <div className='detailBox'>
            <div className='grayText2'>
              <span className="label"><b>클래스</b></span>
              <span>{selectedStudent.classNames && selectedStudent.classNames.length > 0 ? selectedStudent.classNames.join(', ') : '-'}</span>
            </div>
            <div className='grayText2'>
              <span className="label"><b>담당 강사</b></span>
              <span>{selectedStudent.teacherNames && selectedStudent.teacherNames.length > 0 ? selectedStudent.teacherNames.join(', ') : '-'}</span>
            </div>
            <div className='grayText2'>
              <span className="label"><b>수강 과목</b></span>
              <span>{selectedStudent.teacherSubjects && selectedStudent.teacherSubjects.length > 0 ? selectedStudent.teacherSubjects.join(', ') : '-'}</span>
            </div>
            <br />
            <div className='grayText2'>
              <span className="label"><b>휴대폰</b></span>
              <span>({selectedStudent.phone || '-'})</span>
            </div>
            <div className='grayText2'>
              <span className="label"><b>소속</b></span>
              <span>({selectedStudent.schoolName || '-'})</span>
            </div>
            <div className='grayText2'>
              <span className="label"><b>학부모 휴대폰</b></span>
              <span>({selectedStudent.parentPhone})</span>
            </div>
          </div>
        </div>
      ) : (
        filterdStudents.map((s) => (
          <div key={s.studentId} className='student-manage-item'>
            <img src={s.userProfile} alt={s.userProfile}
             className='student-profileCircle' />
            {/* 정보 */}
            <div className='student-manage-Info'>
              <div className='student-infoTop'>
                <span>{s.name}</span>
                <span>{s.phone}</span>
                {s.parentName ? (
                <>
                  <span>{s.parentName}</span>
                  <span>{s.parentPhone}</span>
                </>) : (
                  <span>학부모 정보 없음</span>
                )}
              </div>
              <div className='student-infoBottom'>
                <span>{[...new Set(s.teacherSubjects)].join(', ')}</span>
              </div>
            </div>
            
            <div className='student-manage-buttons'>
              <button className='student-manageBtn'
               onClick={() => setSelectedStudent(s)}>관리</button>
              <button className='student-deleteBtn'
               onClick={() => handleDeleteStudent(s.userId)}>삭제</button>
            </div>
          </div>
        ))
      )}
      </div>

    </div>
  );
};

export default StudentsManage;