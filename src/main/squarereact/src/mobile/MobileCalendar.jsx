import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./mobileCalendar.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const MobileCalendar = () => {
  // 유저 정보 받아오기
  const location = useLocation();
  const academyId = location.state?.acaId; // 소속 학원 PK
  const [events, setEvents] = useState([]);

  // 상담 일정을 위한 디자인 컴포넌트
  function formatTime(datetime) {
    const date = new Date(datetime);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  function renderEventContent(eventInfo) {
    const isConsult = eventInfo.event.title.includes("상담");

    if (isConsult) {
      const time = formatTime(eventInfo.event.start);
      return (
        <div className="fc-consult-dot-wrapper">
          <span className="fc-consult-dot">•</span>
          <span className="fc-consult-tooltip">
            {eventInfo.event.title} <br />
            🕒 {time}
          </span>
        </div>
      );
    }
    return (
      <div className="fc-custom-event">
        <div className="fc-event-title">
          {eventInfo.event.title}
        </div>
      </div>
    );
  }

  useEffect(() => {
    if(!academyId) return;

    // 1. 학원 관련 일정 불러오기
    const fetchSchedules = axios.get(`/public/${academyId}/schedule`);

    // 2. 상담 일정 불러오기
    const fetchConsultations = axios.get(`/public/${academyId}/consultations`);

    // 3. 2개 병렬 처리
    Promise.all([fetchSchedules, fetchConsultations])
      .then(([scheduleRes, consultRes]) => {
        const scheduleEvents = scheduleRes.data.map(item => ({
          title: item.title,
          start: item.startDate,
          end: item.endDate,
          color: item.color,
        }));

        const consultationEvents = consultRes.data.map(item => ({
          title: `${item.name} 상담`,
          start: item.consultationDate,
          end: item.consultationDate,
          color: "#FFA07A", // 고정 색상
        }));

        setEvents([...scheduleEvents, ...consultationEvents]);
      }).catch(err => {
        console.log(err);
        alert("일정 불러오기 실패");
      });
  }, [academyId]);

  return (
    <div className="mobile-calendar-wrapper">
      <div className="mobile-overflow-set"></div>
      <FullCalendar plugins={[dayGridPlugin]}
       initialView="dayGridMonth"
       events={events}
       displayEventTime={false}
       headerToolbar={{
        left: 'prev',
        center: 'title',
        right: 'next'
       }}
       height="auto"
       aspectRatio={0.9}
       contentHeight="auto"
       expandRows={true}
       eventContent={renderEventContent}
      />
    </div>
  );
};

export default MobileCalendar;
