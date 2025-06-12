import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from '../ui/Modal';

const Consultation = () => {
  const location = useLocation();
  const academyId = location.state?.acaId;

  // 권한 조건 확인
  const role = location.state?.role;
  const isEditableRole = role === '원장' || role === '강사';

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newDateTime, setNewDateTime] = useState();

  const fetchConsultations = () => {
    if(academyId) {
      axios.get(`/public/${academyId}/consultations`)
        .then(res => {
          const consultations = res.data;
          const calendarEvents = consultations.map((item) => {
            return {
              id: item.id,
              title: item.name + " 상담",
              start: item.consultationDate,
              allDay: false
            }
          });
          setEvents(calendarEvents);
        }).catch(error => {
          alert(`상담일정 불러오기 실패 ${error}`);
        });
    }
  }

  useEffect(() => {
    fetchConsultations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academyId]);

  // eventClick 핸들러
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    const start = info.event.start;
    if(start) {
      const offset = start.getTimezoneOffset();
      const localDate = new Date(start.getTime() - offset * 60 * 1000);
      const formatted = localDate.toISOString().slice(0, 16);
      setNewDateTime(formatted);
    } else {
      setNewDateTime('');
    }
    setOpenModal(true);
  }

  // 일정 변경
  const handleUpdate = () => {
    if(!newDateTime) {
      alert('신규 일정을 입력해주세요.');
      return;
    }
    const id = selectedEvent.id;
    axios.patch(`/th/${id}/consultation`, newDateTime, {
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    }).then(() => {
      // alert('일정 변경');
      setOpenModal(false);
      fetchConsultations();
    }).catch(err => {
      alert(`일정 변경 실패: ${err}`);
    });
  }

  // 일정 삭제
  const handleDelete = () => {
    const id = selectedEvent.id;
    if(window.confirm('정말 삭제하시겠습니까?')) {
      axios.delete(`/th/${id}/consultation`, {withCredentials: true})
        .then(() => {
          setOpenModal(false);
          fetchConsultations();
        }).catch(err => {
          alert(`삭제 실패: ${err}`);
        });
    }
  }

  return (
    <div style={{width: '100%', height: '100%', overflowY: 'auto', fontSize: '0.8vw'}}>
      <FullCalendar
       plugins={[dayGridPlugin, timeGridPlugin]}
       initialView='dayGridMonth'
       events={events}
       dayHeaders={false}
       eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false
       }}
       eventClick={isEditableRole ? handleEventClick : null}
      />
      
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <div className='schedule-modal-content'>
            <h2 className="schedule-modal-title">상담 일정 변경</h2>
            <hr />
            <div className='schedule-form-group' style={{gap:'10px'}}>
              <label className='schedule-form-label'>{selectedEvent?.title}</label>
            </div>
            <div className='schedule-form-group' style={{gap:'10px'}}>
              <label className='schedule-form-label'>상담 일정</label>
              <span>{selectedEvent?.start ? selectedEvent.start.toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }) : ''}</span>
            </div>
            <div className='schedule-form-group' style={{gap:'10px'}}>
              <label className='schedule-form-label'>신규 일정</label>
              <input type='datetime-local' className='schedule-form-input'
               value={newDateTime} onChange={(e) => setNewDateTime(e.target.value)} />
            </div>
            
            <div className='schedule-button-group'>
              <button className='schedule-btn-save' style={{width:'auto'}}
               onClick={handleUpdate}>일정 변경</button>
              <button className='schedule-btn-del'
               onClick={handleDelete}>삭제</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Consultation;