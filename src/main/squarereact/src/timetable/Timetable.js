import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../attendBook/attend.css';
import './timetable.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import koLocale from '@fullcalendar/core/locales/ko';
import { Tooltip } from 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Timetable = () => {
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

    // 권한에 따른 전용 기능 구현
    //const role = userInfo.role;

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

        if (direction === '오늘') {
            calendarApi.today(); // 오늘 날짜로 이동
            return;
        }

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

    // 시간표 생성 페이지 이동
    const navigate = useNavigate();
    const handleCreateClick = () => {
        navigate('create-timetable', { state: { acaId: userInfo.acaId } });
    };

    // 시간표 편집 페이지 이동
    const handleEditClick =()=>{
        if(selectedTimetable.length === 0){
            alert('선택된 시간표가 없습니다.');
        }else if(selectedTimetable.length > 1){
            alert('하나의 시간표만 선택해주세요.');
        }else {
            const timetableId = selectedTimetable[0].timetableId;
            navigate('update-timetable',{ state: { timetableId, acaId: userInfo.acaId  } });
        }
    }

    // 시간표 삭제 이벤트
    const handleDeleteClick=()=>{
        if(selectedTimetable.length===0){
            alert('삭제할 시간표를 선택해주세요.');
            return;
        }

        //선택된 시간표 제목 모아서 출력용 문자열 생성
        const titles = selectedTimetable.map(t=>t.title).join(',');
        const confirmed=window.confirm(`'${ titles}' 시간표를 삭제하시겠습니까?`);

        if(!confirmed) return

        //선택된 시간표의 id 목록 추출
        const idsToDelete=selectedTimetable.map(t=>t.timetableId);

        //삭제
        Promise.all(
            idsToDelete.map(id=>
                axios.delete(`/public/deleteTimetable?timetableId=${id}`)
            )
        )
        .then(()=>{
            alert('삭제가 완료되었습니다.');
            //삭제된 시간표 제외하고 새로고침
            setTimetableList(prev=>prev.filter(t=>!idsToDelete.includes(t.timetableId)));
            setSelectedTimetable([]);
        }).catch(err=>{
            console.error('삭제 실패:',err);
            alert('삭제 중 오류가 발생했습니다.');
        })
    }

    // 시간표 목록 조회 + 선택
    const [timetableList, setTimetableList] = useState([]);
    const [selectedTimetable, setSelectedTimetable]=useState([]);

    useEffect(()=>{
        if(userInfo.acaId){
            axios.get(`/public/timetablelist?academyId=${userInfo.acaId}`)
            .then(res=>{
                setTimetableList(res.data);
                const today = new Date().toISOString().split('T')[0];
                const ongoing = res.data.filter(t => t.endDate >= today);
                setSelectedTimetable(ongoing);
            });
        }
    },[userInfo.acaId]);
    
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
                    end: `${dateStr}T${tc.endTime === '00:00:00' ? '23:59:59' : tc.endTime}`
                })
            })
        }     
        return events;
    }

    return (
        <div className='attendContainer'>
            <div className='leftContainer' style={{minWidth:'7%', maxWidth:'15%',width:'auto', flexShrink:'0'}}>
                <span className='attendTitle'> 시간표 </span>
                    
                {/* leftContainer */}
                <div className='radioContainer'>
                    {/* 클래스 목록 반복 리스트 ========================= */}
                    {(()=> {
                        const today =new Date().toISOString().split('T')[0]; //'YYYY-MM-DD'
                        const ongoing =timetableList.filter(t=>t.endDate>=today);
                        const ended=timetableList.filter(t=>t.endDate<today);

                        return(
                            <>
                                {/*진행 중 시간표 */}
                                {ongoing.map(t=>(
                                    <label className="radioItem" key={t.timetableId}>
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
                                        <span className="radioText">{t.title}</span>
                                    </label>
                                ))}
                                {/*구분선 */}
                                {ended.length>0&&<hr style={{margin:'10px 0', border:'1px solid black', width:'100%'}}/>}
                                {/*종료된 시간표 */}
                                {ended.map(t=>(
                                    <label className="radioItem" key={t.timetableId}>
                                        <input type='checkbox' name='class'
                                        checked={selectedTimetable.some(sel => sel.timetableId === t.timetableId)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedTimetable(prev => [...prev, t]);
                                            } else {
                                                setSelectedTimetable(prev => prev.filter(sel => sel.timetableId !== t.timetableId));
                                            }
                                        }} />
                                        <span className="radioMark"></span>
                                        <span className="radioText" style={{ color: '#aaa' }}>{t.title}</span>
                                    </label>
                                ))}
                            </>
                        );
                    })()}
                </div>

            </div>


            {/* rightContainer - 우측 시간표 영역 */}
            <div className='timetableContainer'>
              <div className='time-buttons'>

                <div className='time-cal-buttons'>
                <div className='buttonsWrapper3'>
                        <button className='time-selectToday' onClick={() => handleDateNavigate('오늘')} style={{fontSize:'25px'}}
                        >오늘</button>
                </div>

                <div className='buttonsWrapper2'>
                    {['<', '>'].map((label) => (
                        <button
                            key={label}
                            onClick={() => handleDateNavigate(label)}
                            className='time-prevnextbtn'
                            style={{fontSize:'25px'}}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className='buttonsWrapper2'>
                    {['일', '주'].map((label) => (
                        <button
                            key={label}
                            onClick={() => handlePeriodClick(label)}
                            style={{fontSize:'17px'}}
                            className={selectedPeriod === label ? 'selectedButton' : ''}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                </div>
                {/* 학생 & 학부모는 아래 버튼 렌더링 X */}
                {(userInfo.role !== '학생' && userInfo.role !== '학부모') && (
                    <div className='buttonsWrapper'>
                        <button onClick={handleDeleteClick}> 삭제 </button>
                        <button onClick={handleEditClick}> 편집 </button>
                        <button onClick={handleCreateClick}> 시간표 생성 </button>

                    </div>
                )}
              </div>
                <div className='timetable'>
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
                      locale={koLocale}
                      eventDisplay="block"
                      events={events}
                      dayHeaderContent={(args) => { //상단 dayHeader 커스텀
                        const date=args.date;
                        const option={weekday:'long',month:'2-digit',day:'2-digit'};
                        const formatter=new Intl.DateTimeFormat('ko-KR',option);
                        const parts=formatter.formatToParts(date);

                        const weekday=parts.find(p=>p.type==='weekday')?.value;
                        const month=parts.find(p=>p.type==='month')?.value;
                        const day=parts.find(p=>p.type==='day')?.value;

                        return `${weekday} (${month}/${day})`;
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
                        let end = event.end ? new Date(event.end) : null;

                        // 종료 시간이 00:00:00 인 경우 보정 (동일 날짜 23:59:59로)
                        if (!end || (
                            end.getHours() === 0 &&
                            end.getMinutes() === 0 &&
                            end.getSeconds() === 0
                        )) {
                            end = new Date(start);
                            end.setHours(23, 59, 59);
                        }

                        
                        
                        //툴팁 노출
                        const formatTime = (date) =>
                            date.toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            });

                        const timeRange = `${formatTime(start)} ~ ${formatTime(end)}`;
                        const title = event.title;
                        const tooltipHTML = `${timeRange}<br>${title}`;
                        el.setAttribute('data-bs-toggle', 'tooltip');
                        el.setAttribute('data-bs-placement', 'top');
                        el.setAttribute('data-bs-html', 'true');
                        el.setAttribute('title', tooltipHTML);
                        new Tooltip(el, {
                            container: 'body',
                            trigger: 'hover',
                        });

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

        </div>
    );
};

export default Timetable;