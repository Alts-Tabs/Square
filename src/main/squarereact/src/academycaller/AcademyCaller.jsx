import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './AcademyCaller.css';
import Modal from '../ui/Modal';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const AcademyCaller = () => {
  // 유저 정보 받아오기
  const location = useLocation();
  const academyId = location.state?.acaId; // 소속 학원 PK
  
  // 권한에 따른 달력 기능 적용
  const role = location.state?.role; // 유저 권한
  const calendarPlugins = useMemo(() => {
    const base = [dayGridPlugin, timeGridPlugin];
    return (role === '원장' || role === '강사') ? [...base, interactionPlugin] : base;
  }, [role]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 정보
  const [openEventModal, setOpenEventModal] = useState(false);
  const [schedules, setSchedules] = useState([]); // 학원 스케줄
  const [academySchoolList, setAcademySchoolList] = useState([]); // 상태 값
  const [openEditModal, setOpenEditModal] = useState(false); // 수정용 모달

  // 오늘 날짜 구하기
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }

  const fetchAcademySchools = async () => {
    try {
      if(!academyId) return;
      const res = await axios.get(`/public/${academyId}/schools`, {withCredentials:true});
      setAcademySchoolList(res.data);
    } catch(error) {
      alert(`학원 스케줄 연관 학교 목록 fetch fail: ${error}`);
    }
  }

  // 체크박스 필터링 이벤트
  const [selectedFilters, setSelectedFilters] = useState([]);
  const handleCheckboxChange = (value) => {
    setSelectedFilters(prev => 
      prev.includes(value) ? prev.filter(v => v !== value)
      : [...prev, value]
    );
  }

  const filteredSchedules = useMemo(() => {
    if(selectedFilters.length === 0)
      return schedules;
    
    return schedules.filter(event => {
      if(event.type === "ACADEMY") {
        return selectedFilters.includes("ACADEMY");
      } else {
        return selectedFilters.includes(String(event.schoolId));
      }
    });
  }, [selectedFilters, schedules]);

  const fetchSchedules = useCallback(async () => {
    try {
      if(!academyId) return;
      const res = await axios.get(`/public/${academyId}/schedule`, {withCredentials: true});
      const events = res.data.map((item) => {
        const endDateObj = new Date(item.endDate);
        endDateObj.setDate(endDateObj.getDate() + 1); // FullCallendar는 마지막날 기본적으로 배제
        return {
          id: item.scheduleId,
          title: item.title,
          description: item.description,
          start: item.startDate,
          end: endDateObj.toISOString().slice(0, 10)+"T23:59:59",
          originalEnd: item.endDate, // 원본
          type: item.type,
          schoolId: item.schoolId || null,
          allDay: true,
          backgroundColor: item.color,
          textColor: 'black',
          display: 'block',
        };
      });
      // console.log(events);
      setSchedules(events);
    } catch(error) {
      alert('일정 불러오기 실패: '+error);
    }
  }, [academyId]);

  /* 날짜 변경 이벤트 */
  const formatDateOnly = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEventUpdate = (changeInfo) => {
    const event = changeInfo.event;
    const scheduleId = Number(event.id);

    const start = new Date(event.start);
    const end = event.end ? new Date(event.end) : new Date(start);

    // FullCalendar의 end는 exclusive이므로 실제 종료일은 하루 전
    end.setDate(end.getDate() - 1);

    const patchData = {
      startDate: `${formatDateOnly(start)}T00:00:00`,
      endDate: `${formatDateOnly(end)}T23:59:59`,
    };

    axios.patch(`/th/${scheduleId}/dates`, patchData, { withCredentials: true })
      .catch((error) => {
        alert(`일정 변경 실패: ${error.response?.data || error.message}`);
        changeInfo.revert(); // 변경 롤백
      });
  };

  /*======== 모달 이벤트 =========*/
  const [scheduleType, setScheduleType] = useState('ACADEMY'); // 기본 값: 학원 일정
  const [schoolList, setSchoolList] = useState([]); // 모든 학교 목록
  const [selectedSchool, setSelectedSchool] = useState(''); // 선택한 학교 - 값: 학교 PK값
  
  // 생성용
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#79D7BE');
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());

  // 수정용
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editColor, setEditColor] = useState('#79D7BE');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editScheduleType, setEditScheduleType] = useState('ACADEMY');
  const [editSelectedSchool, setEditSelectedSchool] = useState('');
  
  
  // radio 선택으로 인한 select 활성화 & 비활성화
  const handleScheduleTypeChange = (type) => {
    setScheduleType(type);
    setEditScheduleType(type);
    if(type === 'ACADEMY') {
      setSelectedSchool('');
      setEditSelectedSchool('');
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

  // 수정용 이벤트
  const handleEditSaveSchedule = async () => {
    if(!editTitle || !editStartDate || !editEndDate) {
      alert('제목, 시작&종료일 필수입니다.');
      return;
    }
    
    const payload = {
      title: editTitle,
      description: editDescription,
      startDate: `${editStartDate}T00:00:00`, //LocalDateTime 형식
      endDate: `${editEndDate}T23:59:59`,
      type: editScheduleType,
      color: editColor,
      schoolsId: editScheduleType === 'ACADEMIC' ? Number(editSelectedSchool) : null
    };

    try {
      await axios.patch(`/th/${selectedEvent.scheduleId}/updateSchedule`, payload, {withCredentials:true});
      setOpenEditModal(false);
      fetchAcademySchools();
      fetchSchedules();
    } catch(error) {
      alert(`일정 수정 실패: ${error.response?.data?.message || error.message}`);
    }
  }

  // 스케줄 삭제 이벤트
  const handleDeleteSchedule = async () => {
    if(!selectedEvent || !selectedEvent.scheduleId) return;

    const confirmDelete = window.confirm('정말 이 일정을 삭제하시겠습니까?');
    if(!confirmDelete) return;

    try {
      await axios.delete(`/th/${selectedEvent.scheduleId}/delSchedule`, {withCredentials:true});
      alert('일정이 삭제되었습니다.');
      setOpenEditModal(false);
      fetchAcademySchools();
      fetchSchedules();
    } catch(error) {
      alert(`일정 삭제 실패: ${error.response?.data?.message || error.message}`);
    }
  }

  /*================== */

  useEffect(() => {
    fetchSchoolList();
    fetchSchedules(); // academyId를 기반으로 fetch
    fetchAcademySchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className='academy-caller-container'>
      <div className='academy-caller-sidebar'>
        <h2 className='academy-caller-title'>학원 캘린더 </h2>
        {(role === '원장' || role === '강사') &&
          <button type='button' className='caller-registerBtn'
           onClick={() => setOpenModal(true)}>학사일정 등록</button>
        }

        <div className='caller-checkbox-list'>
          <label className='caller-checkbox-item'>
            <input type="checkbox" value="ACADEMY"
             checked={selectedFilters.includes("ACADEMY")}
             onChange={(e) => handleCheckboxChange(e.target.value)} />
            <span>학원 일정</span>
          </label>
          {/* 학교 목록 띄우기 - 반복*/}
          {academySchoolList.map((school) => (
            <label key={school.schoolId} className='caller-checkbox-item'>
              <input type="checkbox" value={school.schoolId}
               checked={selectedFilters.includes(String(school.schoolId))}
               onChange={(e) => handleCheckboxChange(e.target.value)} />
              <span>{school.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 달력 출력 */}
      <div className='academy-calendar-wrapper'>
        <FullCalendar
         plugins={calendarPlugins}
         initialView='dayGridMonth'
         dayHeaders={false}
         height='auto'
         selectable={true}
         editable={role === '원장' || role === '강사'}
         eventDrop={handleEventUpdate}
         eventResize={handleEventUpdate}
         events={filteredSchedules}
         eventClick = {function(info) {
          const clickedEvent = {
            scheduleId: info.event.id,
            title: info.event.title,
            start: info.event.startStr,
            end: info.event.extendedProps.originalEnd.slice(0, 10),
            description: info.event.extendedProps.description || '',
            type: info.event.extendedProps.type,
            schoolId: info.event.extendedProps.schoolId || '',
            color: info.event.backgroundColor
          };

          setSelectedEvent(clickedEvent);
          if(role === '원장' || role === '강사') {
            setEditTitle(clickedEvent.title);
            setEditDescription(clickedEvent.description);
            setEditColor(clickedEvent.color);
            setEditStartDate(clickedEvent.start);
            setEditEndDate(clickedEvent.end);
            setEditScheduleType(clickedEvent.type);
            setEditSelectedSchool(String(clickedEvent.schoolId || ''));
            setOpenEditModal(true);
          } else {
            setOpenEventModal(true); // 읽기 전용
          }
         }} />
      </div>

      {/* 학원 등록 모달 */}
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <div className='schedule-modal-content'>
            <h2 className="schedule-modal-title"> 일정 추가 </h2>
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

      {/* 일정 상세보기 모달 */}
      {openEventModal && selectedEvent && (
        <Modal onClose={() => setOpenEventModal(false)}>
          <div className='schedule-modal-content'>
            <h2 className="schedule-modal-title">일정 상세 보기</h2>
            <hr />
            <div className='schedule-form-group'>
              <label className='schedule-form-label'>제목</label>
              <div>{selectedEvent.title}</div>
            </div>
            <div className='schedule-form-group'>
              <label className='schedule-form-label'>시작</label>
              <div>{selectedEvent.start}</div>
            </div>
            <div className='schedule-form-group'>
              <label className='schedule-form-label'>종료</label>
              <div>{selectedEvent.end}</div>
            </div>
            <div className='schedule-form-group'>
              <label className='schedule-form-label'>설명</label>
              <div>{selectedEvent.description || '-'}</div>
            </div>
            <div className='schedule-button-group'>
              <button className='schedule-btn-cancel'
               onClick={() => setOpenEventModal(false)}>닫기</button>
            </div>
          </div>
        </Modal>
      )}

      {/* 일정 전체 수정용 모달 */}
      {openEditModal && selectedEvent && (
        <Modal onClose={() => setOpenEditModal(false)}>
          <div className='schedule-modal-content'>
            <h2 className="schedule-modal-title">일정 수정</h2>
            <hr />
            <div className='schedule-form-group'>
              <label className='schedule-form-label'>종류</label>
              <div className='schedule-radio-group'>
                <label className="schedule-custom-radio">
                  학원 일정
                  <input type='radio' name='type' value='ACADEMY'
                   checked={editScheduleType === 'ACADEMY'}
                   onChange={() => handleScheduleTypeChange('ACADEMY')} />
                </label>
                <label className="schedule-custom-radio">
                  학사 일정
                  <input type='radio' name='type' value='ACADEMIC'
                   checked={editScheduleType === 'ACADEMIC'}
                   onChange={() => handleScheduleTypeChange('ACADEMIC')} />
                </label>
              </div>
            </div>

            <div className='schedule-form-group'>
              <label className='schedule-form-label'>학교</label>
              <select className='schedule-form-input'
               value={editSelectedSchool}
               onChange={(e) => setEditSelectedSchool(e.target.value)}
               disabled={editScheduleType === 'ACADEMY'}>
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
              <input type='text' value={editTitle} className='schedule-form-input'
               onChange={(e) => setEditTitle(e.target.value)} />
            </div>
              
            <div className='schedule-form-group'>
              <label className='schedule-form-label'>설명</label>
              <textarea className='schedule-form-input' value={editDescription}
               onChange={(e) => setEditDescription(e.target.value)}></textarea>
            </div>
              
            <div className='schedule-form-group'>
              <label className='schedule-form-label'>색깔</label>
              <input type='color' value={editColor} className='schedule-form-input'
               style={{ width: '30%' }}
               onChange={(e) => setEditColor(e.target.value)} />
            </div>
              
            <div className='schedule-form-group'>
              <label className='schedule-form-label'>시작</label>
              <input type='date' className='schedule-form-input'
               value={editStartDate}
               onChange={(e) => setEditStartDate(e.target.value)} />
            </div>
              
            <div className='schedule-form-group'>
              <label className='schedule-form-label'>종료</label>
              <input type='date' className='schedule-form-input'
               value={editEndDate}
               onChange={(e) => setEditEndDate(e.target.value)} />
            </div>
              
            <div className='schedule-button-group'>
              <button className='schedule-btn-save'
               onClick={handleEditSaveSchedule}>
                수정
              </button>
              <button className='schedule-btn-del'
               onClick={handleDeleteSchedule}>삭제</button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default AcademyCaller;