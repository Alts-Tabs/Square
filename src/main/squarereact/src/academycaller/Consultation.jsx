import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Consultation = () => {
  const location = useLocation();
  const academyId = location.state?.acaId;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if(academyId) {
      axios.get(`/public/${academyId}/consultations`)
        .then(res => {
          const consultations = res.data;
          const calendarEvents = consultations.map((item) => {
            return {
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
  }, [academyId]);

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
       />
    </div>
  );
};

export default Consultation;