import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../attendBook/attend.css';
import '../settings/classSetting.css';
import Modal from '../ui/Modal';
import './classStudentsManage.css';
import axios from 'axios';

const ClassStudentsManage = () => {
  const {acaId} = useParams(); // api에 사용될 값

  const [openModal, setOpenModal] = useState(false); // 모달 여닫기
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');

  // 수강생 목록 호출
  const fetchAllStudents = () => {
    if(!acaId) return;

    axios.get(`/public/${acaId}/students`, {withCredentials: true,})
    .then(res => {
      setStudents(res.data);
      setAllStudents(res.data);
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

  // acaId(학원) 바뀔 때 1번만 부르기
  useEffect(() => {
    fetchClassList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acaId]);

  // 첫 렌더링 및 검색&필터 시점만 호출
  useEffect(() => {
    fetchAllStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 검색 함수
  const handleSearch = () => {
    const trimmedKeyword = searchKeyword.trim();

    if(trimmedKeyword === '') {
      fetchAllStudents();
    }
    
    axios.get(`/public/${acaId}/students/search`, {
      params: { keyword: trimmedKeyword},
      withCredentials: true
    }).then(res => {
      setStudents(res.data);
    }).catch(err => {
      alert("검색 실패", err);
    });
  }

  // 학생 필터링
  const filterdStudents = students.filter(student => {
    if(!selectedClassId) return true;
    return student.classIds?.includes(parseInt(selectedClassId));
  });

  /* 모달 이벤트 - 학생 등록 */
  const [selModalClass, setSelModalClass] = useState('');
  const [selStudentIds, setSelStudentIds] = useState([]);
  const [selStudentNames, setSelStudentNames] = useState([]);
  const [modalError, setModalError] = useState('');
  const [modalErrorList, setModalErrorList] = useState([]); // studentId, code, message

  // 선택 이벤트
  const handleSelectStudent = (e) => {
    const studentId = parseInt(e.target.value);
    if(!studentId || selStudentIds.includes(studentId)) return;

    const selectedStudent = allStudents.find(s => s.studentId === studentId);
    if(!selectedStudent) return;

    setSelStudentIds(prev => [...prev, studentId]);
    setSelStudentNames(prev => [...prev, selectedStudent.name]);
  }
  // 선택 취소 이벤트
  const removeSelectedStudent = (index) => {
    setSelStudentIds(prev => prev.filter((_, i) => i !== index));
    setSelStudentNames(prev => prev.filter((_, i) => i !== index));
  }

  // 저장 버튼
  const handleSaveToClass = () => {
    setModalError('');

    if(!selModalClass || selStudentIds.length === 0 ) {
      setModalError('클래스와 학생 모두 선택하세요.');
      setModalErrorList([]);
      return;
    }

    axios.post(`/th/${selModalClass}/register`, selStudentIds, {
      headers: { 'Content-Type': 'application/json'},
      withCredentials: true
    }).then(res => {
      const result = res.data;
      if(result.errors && result.errors.length > 0) {
        setModalErrorList(result.errors);
      } else {
        setOpenModal(false);
        setSelModalClass('');
        setSelStudentIds([]);
        setSelStudentNames([]);
        fetchAllStudents(); // 갱신
      }
    }).catch(err => {
      // 💡 서버가 RegisterResultDto를 반환한 경우
      if (err.response?.data?.errors) {
        setModalErrorList(err.response.data.errors);
      } else {
        // 예기치 않은 에러
        setModalError('서버 오류가 발생했습니다.');
      }
    });
  }
  /* 모달 이벤트 끝 */

  // 학생 클래스 제거 이벤트
  const handleRemoveStudent = (student) => {
    // 필터링 된 경우
    if(selectedClassId) {
      const classId = parseInt(selectedClassId);

      axios.delete(`/th/${classId}/unregister`, {
        data: [student.studentId],
        headers: {'Content-Type': 'application/json'},
        withCredentials: true
      }).then(() => {fetchAllStudents()})
      .catch(() => {alert("학생 클래스 해제 실패")});

    } else {
      // 미 필터링 상태
      const promises = (student.classIds || []).map(classId => 
        axios.delete(`/th/${classId}/unregister`, {
          data: [student.studentId],
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
        })
      );

      Promise.all(promises).then(() => {fetchAllStudents()})
      .catch(() => {alert("학생 클래스 해제 실패")});
    }
  }

  return (
    <div className='studentsManageWrapper'>
      <span className='attendTitle'> 수강생 관리 </span>

      <div className='listHeader' style={{ justifyContent: 'normal' }}>
        {/* 클래스 필터 */}
        <select className='classFilter' style={{ width: '14%', marginRight: '10px' }}
         value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
          <option value=''> 클래스 필터 </option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>

        {/* + 수강생 추가 버튼 & 모달 */}
        <i className="bi bi-plus-lg" onClick={() => setOpenModal(true)}></i>

        {openModal && (
          <Modal onClose={() => setOpenModal(false)}>
            <div style={{ width: '100%' }}>
              <span style={{ fontSize: '28px', color: '#2E5077', fontWeight: '700' }}>
                클래스 배정
              </span>
              <hr />

              <div className='modalContent'>
                {/* 1. 먼저 클래스를 선택합니다. */}
                <div className='formRow'>
                  <div className='grayText2 label'> <b> 클래스 </b></div>
                  <select className='classFilter' style={{ width: '70%' }}
                   value={selModalClass} onChange={(e) => setSelModalClass(e.target.value)}>
                    <option value=''> 클래스 필터 </option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. 전체 학생 목록에서 선택 */}
                <div className='formRow'>
                  <div className='grayText2 label'> <b> 학생명 </b></div>
                  <select className='classFilter' style={{ width: '70%' }}
                   onChange={handleSelectStudent}>
                    <option value=''> 학생 선택 </option>
                    {allStudents.map(s => (
                      <option key={s.studentId} value={s.studentId}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 선택된 학생 목록 */}
              <div className='selectStudentList'>
                {selStudentNames.map((name, index) => (
                  <div key={index} className='selectedStudentItem'>
                    {name}
                    <i className="bi bi-x-lg" onClick={() => removeSelectedStudent(index)} style={{ marginLeft: '5px', cursor: 'pointer' }}></i>
                  </div>
                ))}
              </div>

              {/* 등록 실패 에러문 */}
              {modalError && <div className='modalErrorText'>{modalError}</div>}
              {modalErrorList.length > 0 && (
                <div className='modalErrorList'>
                  {modalErrorList.map((err, idx) => (
                    <div key={idx} className='modalErrorItem'>
                      {err.studentId ? `학생 ID ${err.studentId}: `: ''}
                      {err.message}
                    </div>
                  ))}
                </div>
              )}


              {/* 선택하고 저장 누르면 그 학생은 클래스에 속해짐 */}
              <button className='modalAddBtn' onClick={handleSaveToClass}> 저장 </button>
            </div>
          </Modal>
        )}

        {/* 학생 검색창 */}
        <input type='text' className='searchStudents'
         placeholder="학생 검색" value={searchKeyword}
         onChange={(e) => setSearchKeyword(e.target.value)}
         onKeyDown={(e) => {
          if(e.key === 'Enter') handleSearch();
         }}></input>
        <i className="bi bi-search" onClick={handleSearch}></i> {/* 돋보기 아이콘 */}
      </div>


      <div className='studentsManageBody'>
        {filterdStudents.map((student) => (
          <div className='studentCard' key={student.studentId}>
            <i className="bi bi-x-lg" onClick={() => handleRemoveStudent(student)}></i> {/* X 삭제 아이콘 */}
            
            <div className='studentPhoto'></div> {/* 학생 프로필 이미지란 */}

            {/* 학생명, Role, 등록일자 */}
            <div className='nameBox'>
              <span className='studentName'> {student.name} </span>
              <br />
              <span className='grayText'> <b> 학생👤 </b> </span>
              <span className='grayText'> <b> 등록일자 </b>&nbsp;&nbsp; ({student.regDate}) </span>
              <hr />
            </div>

            {/* 클래스, 담당 강사, 수강 과목 */}
            <div className='detailBox'>
              <div className='grayText2'>
                <span className="label"><b>클래스</b></span>
                <span>{student.classNames && student.classNames.length > 0 ? student.classNames.join(', ') : '-'}</span>
              </div>
              <div className='grayText2'>
                <span className="label"><b>담당 강사</b></span>
                <span> - </span> {/* 추후 추가하기 */}
              </div>
              <div className='grayText2'>
                <span className="label"><b>수강 과목</b></span>
                <span> - </span> {/* 추후 추가하기 */}
              </div>
              <br />

              <div className='grayText2'>
                <span className="label"><b>휴대폰</b></span>
                <span>({student.phone || '-'})</span>
              </div>
              <div className='grayText2'>
                <span className="label"><b>소속</b></span>
                <span>({student.schoolName || '-'})</span>
              </div>
              <div className='grayText2'>
                <span className="label"><b>학부모 휴대폰</b></span>
                <span>({student.parentPhone})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassStudentsManage;