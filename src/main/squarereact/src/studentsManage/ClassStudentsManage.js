import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../attendBook/attend.css';
import '../settings/classSetting.css';
import Modal from '../ui/Modal';
import './classStudentsManage.css';

const ClassStudentsManage = () => {
  const {acaId} = useParams(); // api에 사용될 값

  const [openModal, setOpenModal] = useState(false); // 모달 여닫기

  // 날짜 관련
  const dateInputRef = useRef(null);
  const date = new Date().toISOString().slice(0, 16);
  const [defaultDate, defaultTime] = date.split("T");
  const defaults = `${defaultDate} ${defaultTime}:00`;
  const [formatDay, setFormatDay] = useState(defaults);

  const handleIconClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  }

  // api로 보낼 값
  const username = sessionStorage.getItem("username").toString();
  const [endday, setEndday] = useState(date);

  const handleDateChange = (e) => {
    const raw = e.target.value;
    setEndday(raw);

    // ui 시간 변경
    const [date, time] = raw.split("T");
    const formatted = `${date} ${time}:00`;
    setFormatDay(formatted);
    // console.log(endday);
  }

  return (
    <div className='studentsManageWrapper'>
      <span className='attendTitle'> 수강생 관리 </span>

      <div className='listHeader' style={{ justifyContent: 'normal' }}>
        {/* 클래스 필터 */}
        <select className='classFilter' style={{ width: '14%', marginRight: '10px' }}>
          <option> 클래스 필터 </option>
          <option> 클래스 A </option>
        </select>

        {/* + 수강생 추가 버튼 & 모달 */}
        <i class="bi bi-plus-lg" onClick={() => setOpenModal(true)}></i>

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
                  <select className='classFilter' style={{ width: '70%' }}>
                    <option> 클래스 필터 </option>
                    <option> 클래스 A </option>
                  </select>
                </div>

                {/* 2. 1에서 선택한 클래스 내의 학생만 토글로 드롭다운 */}
                <div className='formRow'>
                  <div className='grayText2 label'> <b> 학생명 </b></div>
                  <select className='classFilter' style={{ width: '70%' }}>
                    <option> 학생 선택 </option>
                    <option> 조고래 </option>
                  </select>
                </div>
              </div>

              <button className='modalAddBtn'> 저장 </button>
            </div>
          </Modal>
        )}

        {/* 학생 검색창 */}
        <input type='text' className='searchStudents' placeholder="학생 검색"></input>
        <i class="bi bi-search"></i> {/* 돋보기 아이콘 */}
      </div>


      <div className='studentsManageBody'>
        {/* 이하 반복 리스트 (횡 스크롤 됩니다.) =================================================== */}
        <div className='studentCard'>
          <i className="bi bi-x-lg"></i> {/* X 삭제 아이콘 */}
          <div className='studentPhoto'></div> {/* 학생 프로필 이미지란 */}

          {/* 학생명, Role, 등록일자 */}
          <div className='nameBox'>
            <span className='studentName'> (학생1) </span>
            <br />
            <span className='grayText'> <b> 학생👤 </b> </span>
            <span className='grayText'> <b> 등록일자 </b>&nbsp;&nbsp; (2025.05.27) </span>

            <hr />
          </div>

          {/* 클래스, 담당 강사, 수강 과목 */}
          <div className='detailBox'>
            <div className='grayText2'><span className="label"><b>클래스</b></span><span>(A반)</span></div>
            <div className='grayText2'><span className="label"><b>담당 강사</b></span><span>(강사1)</span></div>
            <div className='grayText2'><span className="label"><b>수강 과목</b></span><span>(주2회_기하와 백터)</span></div>
            <br />

            <div className='grayText2'><span className="label"><b>휴대폰</b></span><span>(010-0000-1111)</span></div>
            <div className='grayText2'><span className="label"><b>소속</b></span><span>(비트 고등학교)</span></div>
            <div className='grayText2'><span className="label"><b>학부모 휴대폰</b></span><span>(010-0000-9999)</span></div>
          </div>

        </div>
        {/* ======================================================================================= */}

      </div>
    </div>
  );
};

export default ClassStudentsManage;