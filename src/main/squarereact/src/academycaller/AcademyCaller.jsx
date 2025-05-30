import React, { useCallback, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './AcademyCaller.css';
import Modal from '../ui/Modal';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const AcademyCaller = () => {
  // 학원 PK 값 상태로 받기
  const location = useLocation();
  const academyId = location.state?.acaId;

  const [openModal, setOpenModal] = useState(false);
  const [schedules, setSchedules] = useState([]); // 학원 스케줄

  // 오늘 날짜 구하기
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }

  const fetchSchedules = useCallback(async () => {
    try {
      if(!academyId) return;
      const res = await axios.get(`/public/${academyId}/schedule`, {withCredentials: true});
      const events = res.data.map((item) => {
        const endDateObj = new Date(item.endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        return {
          id: item.scheduleId,
          title: item.title,
          description: item.description,
          start: item.startDate,
          end: endDateObj.toISOString().slice(0, 10)+"T23:59:59",
          backgroundColor: item.color,
          textColor: 'black',
          display: 'block',
          allDay: true,
        };
      });
      // console.log(events);
      setSchedules(events);
    } catch(error) {
      alert('일정 불러오기 실패: '+error);
    }
  }, [academyId]);

  /*======== 모달 이벤트 =========*/
  const [scheduleType, setScheduleType] = useState('ACADEMY'); // 기본 값: 학원 일정
  const [schoolList, setSchoolList] = useState([]); // 모든 학교 목록
  const [selectedSchool, setSelectedSchool] = useState(''); // 선택한 학교 - 값: 학교 PK값
  

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#79D7BE');
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());
  
  
  // radio 선택으로 인한 select 활성화 & 비활성화
  const handleScheduleTypeChange = (type) => {
    setScheduleType(type);
    if(type === 'ACADEMY') {
      setSelectedSchool('');
    }
  }

  // 모든 학교 목록 - select option
  const fetchSchoolList = async () => {
    try {
      const res = await axios.get('/public/schools', {withCredentials: true});
      setSchoolList(res.data); // data[schoolId, name]
    } catch (error) {
      alert(`학교 목록 fetch 실패 ${error}`)
    }
  }

  // 저장 버튼
  const handleSaveSchedule = async () => {
    if(!title || !startDate || !endDate) {
      alert('제목, 시작&종료일 필수입니다.');
      return;
    }

    const payload = {
      academyId: academyId,
      title: title,
      description: description,
      startDate: `${startDate}T00:00:00`, //LocalDateTime 형식
      endDate: `${endDate}T23:59:59`,
      type: scheduleType,
      color: color,
      schoolId: scheduleType === 'ACADEMIC' ? Number(selectedSchool) : null
    };

    try {
      await axios.post('/th/schedule/save', payload, {withCredentials: true});
      alert('일정이 저장되었습니다.');
      setOpenModal(false);
      fetchSchedules(); // 목록 재호출
      // 초기화
      setTitle('');
      setDescription('');
      setSelectedSchool('');
      setScheduleType('ACADEMY');
    } catch(error) {
      alert(`일정 저장 실패: ${error.response?.data?.message || error.message}`);
    }
  }

  /*================== */

  useEffect(() => {
    fetchSchoolList();
    fetchSchedules(); // academyId를 기반으로 fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className='academy-caller-container'>
      <div className='academy-caller-sidebar'>
        <h2 className='academy-caller-title'>학원 캘린더</h2>
        <button type='button' className='caller-registerBtn'
         onClick={() => setOpenModal(true)}>학사일정 등록</button>

        <div className='caller-checkbox-list'>
          <label className='caller-checkbox-item'>
            <input type="checkbox" />
            <span>학원 일정</span>
          </label>
          {/* 학교 목록 띄우기 */}
          <label className='caller-checkbox-item'>
            <input type="checkbox" />
            <span>222</span>
          </label>
        </div>
      </div>

      {/* 달력 출력 */}
      <div className='academy-calendar-wrapper'>
        <FullCalendar
         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
         initialView='dayGridMonth'
         dayHeaders={false}
         height='auto'
         selectable={true}
         editable={true}
         events={schedules}
         eventClick={function(info) {
          alert(info.event._def.title + info.event._def.extendedProps.description);
         }}
        />
      </div>

      {/* 학원 등록 모달 */}
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <div className='schedule-modal-content'>
            <h2 className="schedule-modal-title">학사 일정 추가</h2>
            <hr />
            <div className='schedule-form-group'>
              <label className='schedule-form-label'>종류</label>
              <div className='schedule-radio-group'>
                <label className="schedule-custom-radio">
                  학원 일정
                  <input type='radio' name='type' value='ACADEMY'
                   checked={scheduleType === 'ACADEMY'}
                   onChange={() => handleScheduleTypeChange('ACADEMY')} />
                </label>
                <label className="schedule-custom-radio">
                  학사 일정
                  <input type='radio' name='type' value='ACADEMIC'
                   checked={scheduleType === 'ACADEMIC'}
                   onChange={() => handleScheduleTypeChange('ACADEMIC')} />
                </label>
              </div>
            </div>

            <div className='schedule-form-group'>
              <label className='schedule-form-label'>학교</label>
              <select className='schedule-form-input'
               value={selectedSchool}
               onChange={(e) => setSelectedSchool(e.target.value)}
               disabled={scheduleType === 'ACADEMY'}>
                <option value=''>학교를 선택하세요.</option>
                {schoolList.map((school) => (
                  <option key={school.schoolId} value={school.schoolId}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='schedule-form-group'>
              <label className='schedule-form-label'>이름</label>
              <input type='text' value={title} className='schedule-form-input'
               onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className='schedule-form-group'>
              <label className='schedule-form-label'>설명</label>
              <textarea className='schedule-form-input' value={description}
               onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <div className='schedule-form-group'>
              <label className='schedule-form-label'>색깔</label>
              <input type='color' value={color} className='schedule-form-input'
               style={{width:'30%'}}
               onChange={(e) => setColor(e.target.value)} />
            </div>

            <div className='schedule-form-group'>
              <label className='schedule-form-label'>시작</label>
              <input type='date' className='schedule-form-input' value={startDate}
               onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className='schedule-form-group'>
              <label className='schedule-form-label'>종료</label>
              <input type='date' className='schedule-form-input' value={endDate}
               onChange={(e) => setEndDate(e.target.value)} />
            </div>

            <div className='schedule-button-group'>
              <button className='schedule-btn-save'
               onClick={handleSaveSchedule}>저장</button>
              <button className='schedule-btn-cancel'
               onClick={() => setOpenModal(false)}>취소</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AcademyCaller;