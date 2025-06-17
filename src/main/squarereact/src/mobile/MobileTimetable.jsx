import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './mobileTimetable.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MobileTimetable = () => {
    // 로그인 시 받은 사용자 정보 상태
    const [userInfo, setUserInfo] = useState({name: '', role: '', username: '', acaId: '', userId: ''});
        const navi = useNavigate();

        useEffect(() => {
            axios.get("/public/user", {withCredentials: true})
                .then(res => {
                    const {name, role, username, acaId, userId} = res.data;
                    setUserInfo({name, role, username, acaId, userId});
                }).catch(() => {
                    navi("/login");
                });
        }, [navi]);

    // 시간표 목록 조회 + 선택
    const [timetableList, setTimetableList] = useState([]);
    const [selectedTimetable, setSelectedTimetable]=useState([]);

    useEffect(()=>{
        if(userInfo.acaId){
            //console.log("acaId:",userInfo.acaId);
            axios.get(`/public/timetablelist?academyId=${userInfo.acaId}`)
            .then(res=>{
                setTimetableList(res.data);
                const today = new Date().toISOString().split('T')[0];
                const ongoing = res.data.filter(t => t.endDate >= today);
                setSelectedTimetable(ongoing);
            });
        }
    },[userInfo.acaId]);
    
    //endTime 중 가장 마지막 endTime 계산
    const [slotMaxTime, setSlotMaxTime] = useState('23:00:00');// 기본 값 설정

    const getMaxEndTime = (eventList) => {
        if (eventList.length === 0) return '23:00:00';

        //문자열 비교로 정확히 midnight인 event가 있는지 확인
        const hasMidnight = eventList.some(e => {
            const endStr = typeof e.end === 'string' ? e.end : e.end.toISOString();
            return endStr.endsWith('T00:00:00') || endStr.endsWith('T00:00:00.000Z');
        });

        if (hasMidnight) return '24:00:00';

        //나머지: 가장 늦은 종료 시각 계산
        const adjustedEndTimes = eventList.map(e => new Date(e.end));
        const latest = new Date(Math.max(...adjustedEndTimes.map(d => d.getTime())));
        const hours = latest.getHours().toString().padStart(2, '0');
        const minutes = latest.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}:00`;
    };

    //선택된 시간표의 timecontents 조회 + 반복 일정 생성
    const [events, setEvents] =useState([]);
    useEffect(()=>{
        if (selectedTimetable.length === 0) {
            setEvents([]);
            return;
        }

        Promise.all(
            selectedTimetable.map(t =>
                axios.get(`/public/${t.timetableId}/timecontents`).then(res=>({
                    timetable:t,
                    timecontents: res.data,
                }))
            )
        ).then(result=>{
            const allEvents= result.flatMap(({timetable,timecontents})=>
                generateRepeatedEvents(timecontents,timetable.startDate,timetable.endDate)
            );
            setEvents(allEvents);
            setSlotMaxTime(getMaxEndTime(allEvents));
        });
    },[selectedTimetable]);

    //요일 반복 이벤트 함수 생성
    const generateRepeatedEvents = (timecontents,startDate,endDate)=>{
        const start= new Date(startDate);
        const end = new Date(endDate);
        const events=[];
        
        for(let d=new Date(start); d<=end;d.setDate(d.getDate()+1)){
            const day=d.getDay(); //현재 요일
            const dateStr=d.toISOString().split('T')[0];

            timecontents
            .filter(tc=>tc.dayOfWeek===day)
            .forEach(tc=>{
                let title='';
                if(tc.classId&&tc.className){
                    title=tc.className;
                }else if(!tc.classId && tc.description){
                    title = tc.description;
                }

                events.push({
                    id: `${dateStr}-${tc.startTime}-${tc.endTime}-${title}`, // 고유한 id 부여
                    title:title,
                    start: `${dateStr}T${tc.startTime}`,
                    end: `${dateStr}T${tc.endTime}`
                })
            })
        }     
        return events;
    }
    // '일', '주' 중 하나만 선택 =======================================
    const [selectedPeriod, setSelectedPeriod] = useState('주');
    const calendarRef = useRef(null);
    const handlePeriodClick = (period) => {
        if (selectedPeriod === period) {
            setSelectedPeriod(''); // 이미 선택된 버튼은 다시 누르면 해제됨.
        } else {
            setSelectedPeriod(period); // 버튼 선택
            const calendarApi=calendarRef.current?.getApi();
            if(calendarApi){
                calendarApi.changeView(period === '일' ? 'timeGridDay' : 'timeGridWeek');
            }
        }
    };

    //'<', '>' 클릭 이벤트
    const handleDateNavigate = (direction) => {
        const calendarApi = calendarRef.current?.getApi();
        if(!calendarApi) return;

        if(selectedPeriod === '일'){
            if(direction === '<'){
                calendarApi.prev();//이전 날짜
            }else{
                calendarApi.next();//다음 날짜
            }
        }else{
            if(direction==='<'){
                calendarApi.prev();//이전 주
            }else {
                calendarApi.next(); //다음 주
            }
        }
    };


    return (
        <div className='m-timetable-container'>
            <div className='m-timetable-title'>
                <h3 className='m-time-title'>시간표</h3>
            </div>            

            <div className='m-time-top-container'>
                {/*클래스 목록 반복 리스트 ============= */}
                {(()=>{
                    const today =new Date().toISOString().split('T')[0]; //'YYYY-MM-DD'
                    const ongoing =timetableList.filter(t=>t.endDate>=today);
            
                    return(
                        <>
                            {ongoing.map(t=>(
                                <label className="m-radioItem" key={t.timetableId}>
                                   <input type='checkbox' name='class' checked={selectedTimetable.some(sel => sel.timetableId === t.timetableId)}
                                        onChange={(e)=>{
                                            if(e.target.checked){
                                                setSelectedTimetable(prev=>[...prev,t]);
                                            }else {
                                                setSelectedTimetable(prev => prev.filter(sel => sel.timetableId !== t.timetableId));
                                            }
                                        }}
                                    />
                                    <span className="radioMark"></span>
                                    <span className="radioText" style={{marginRight:"5px", marginLeft:"5px"}}>{t.title}</span>
                                </label>
                            ))}
                        </>
                    );
                })()}
            </div>
            <div className='m-timetab-button'>
            <div className='m-buttonsWrapper3'>
                    <button className='m-time-selectToday' onClick={() => handleDateNavigate()} style={{fontSize:'20px'}}
                    >오늘</button>
            </div>

            <div className='m-buttonsWrapper2'>
                {['<', '>'].map((label) => (
                    <button
                        key={label}
                        onClick={() => handleDateNavigate(label)}
                        className='m-time-prevnextbtn'
                        style={{fontSize:'23px'}}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className='m-buttonsWrapper2'>
                {['일', '주'].map((label) => (
                    <button
                        key={label}
                        onClick={() => handlePeriodClick(label)}
                        className={selectedPeriod === label ? 'm-selectedButton' : ''}
                        style={{fontSize:'21px'}}
                    >
                        {label}
                    </button>
                ))}
            </div>
            </div>{/*.m-timetab-button 끝 */}
            
            <div className='m-timetable'>
                <FullCalendar
                  plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
                  initialView='timeGridWeek'
                  ref={calendarRef}
                  headerToolbar={false}
                  dayHeaders={true}
                  allDaySlot={false}
                  eventOverlap={false}
                  slotEventOverlap={false}
                  slotDuration= {'00:10:00'}
                  allDayClassNames={false}
                  nowIndicator={true}
                  height='98%'
                  eventTimeFormat={false}
                  scrollTime={new Date().toTimeString().slice(0, 8)} //현재시간에 자동으로 포커스
                  eventDisplay="block"
                  slotMaxTime={slotMaxTime} //가장 나중 endTime
                  events={events}
                  dayHeaderContent={(args) => { //상단 dayHeader 커스텀
                        const date=args.date;
                        const option={weekday:'narrow',month:'2-digit',day:'2-digit'};
                        const formatter=new Intl.DateTimeFormat('ko-KR',option);
                        const parts=formatter.formatToParts(date);

                        const weekday=parts.find(p=>p.type==='weekday')?.value;
                        const month=parts.find(p=>p.type==='month')?.value;
                        const day=parts.find(p=>p.type==='day')?.value;

                        return `${month}/${day} (${weekday})`;
                    }}
                      eventContent={(arg) => { // class 명만 노출되도록 수정
                        return (
                        <div className='fc-event-title'>{arg.event.title}</div>
                        );
                    }}
                      eventDidMount={(info)=>{ //동일날짜 같은 시간대 여러 일정이 있는 경우 width 조정용
                        const event = info.event;
                        const el = info.el;
                        const view = info.view;

                        //console.log('>>> el', el);
                        // null 체크 추가
                        if (!(event.start instanceof Date) || !(event.end instanceof Date)) return;
                        
                        const start = new Date(event.start);
                        const end = new Date(event.end);
                        const dateStr = event.start.toISOString().split('T')[0];
                        
                        

                        const allInstances = Object.values(view.getCurrentData().eventStore.instances);

                        const isTimeOverlap = (aStart, aEnd, bStart, bEnd) => {
                            return aStart < bEnd && aEnd > bStart;
                        };

                        const sameTimeEvents = allInstances.filter((inst) => {
                            const instStart = inst.range.start?.getTime?.();
                            const instEnd = inst.range.end?.getTime?.();
                            const instDateStr = inst.range.start?.toISOString?.().split('T')[0];

                            return(
                                instStart != null &&
                                instEnd != null &&
                                instDateStr === dateStr &&
                                isTimeOverlap(start, end, instStart, instEnd) // 겹치는 시간
                            );
                        });

                        // sameTimeEvents.forEach((e) => {
                        //     console.log("시작", e.range.start?.getTime?.(), "종료", e.range.end?.getTime?.());
                        // });

                        // index 계산을 느슨하게 & fallback 보완
                        const index = sameTimeEvents.findIndex((inst) => {
                            const sDiff = Math.abs(inst.range.start.getTime() - start);
                            const eDiff = Math.abs(inst.range.end.getTime() - end);
                            return sDiff < 1000 && eDiff < 1000 && inst.def?.title === event.title;
                        });

                        const safeIndex = index !== -1 ? index : 0;

                        //핵심 수정: mainDiv → el (전체 이벤트 DOM에 직접 스타일)
                        if (sameTimeEvents.length >1){
                            const width = 93 / sameTimeEvents.length; // 겹치는 이벤트 수로 나누기
                            el.style.position = 'absolute';
                            el.style.width = `${width}%`;
                            el.style.left = `${width * safeIndex}%`;
                            el.style.zIndex = '5';
                        }else {
                            el.style.position = 'absolute'; // 겹치지 않을 때는 기본 위치
                            el.style.width = '95%'; // 단일 이벤트는 98% 유지
                            el.style.left = '0'; // 좌측 정렬
                            el.style.zIndex = '10';
                        }
                     }}                  
                />
            </div>

        </div>
    );
};

export default MobileTimetable;