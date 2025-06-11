import React, { useEffect, useState } from 'react';
import '../attendBook/attend.css';
import '../settings/classSetting.css';
import './timetable.css';
import './updateTimetable.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { type } from '@testing-library/user-event/dist/type';

const UpdateTimetable = () => {
    const location = useLocation(); 
    const acaId = location.state?.acaId;
    const timetableId = location.state?.timetableId;
    const [selectedClassValue, setSelectedClassValue] = useState('');
    const [selectedList, setSelectedList] = useState([]);
    const [title, setTitle] = useState('');
    const [classList, setClassList]=useState([]);
    const [daySort, setDaySort] = useState(1);
    const [dayList, setDayList] = useState(['토요일']); // 선택된 요일 배열
    const [sort, setSort] = useState("CLASS"); 
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timetable, setTimetable] = useState({}); // 구조: {rowIndex: {colIndex: item}}
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const handleStartTimeChange = (e) => setStartTime(e.target.value);
    const handleEndTimeChange = (e) => setEndTime(e.target.value);
    const [editingCell, setEditingCell] = useState(null); // {rowIndex, colIndex}
    const [editingText, setEditingText] = useState('');
    const navigate = useNavigate();

    //클래스 목록 불러오기
    useEffect(()=>{
        if(!acaId) return;//acaId 없으면 요청 안함
        axios.get(`/th/${acaId}/classes`,{withCredentials:true})
            .then(res=>{
                setClassList(res.data);
            })
            .catch(err=>{
                console.error("클래스 목록 불러오기 실패 : ",err);
            });
    },[acaId]);

    //시작시간, 종료시간 선택 시 오른쪽 영역에 시간 표시되는 내용
    const getTimeRanges = (start, end) => {
        //console.log("startTime:", startTime, "endTime:", end);
        if (!start || !end) return [];
        const ranges = [];
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        let current = new Date(0, 0, 0, startH, startM);
        const endTime = new Date(0, 0, 0, endH, endM);
        
        // 시작 시간이 종료 시간보다 늦으면 → 다음날로 처리
        if (endTime <= current) {
            endTime.setDate(endTime.getDate() + 1);
        }

        while (current < endTime) {
            const next = new Date(current);
            next.setHours(current.getHours() + 1);
            const formatTime = (date) => {
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const ampm = hours >= 12 ? '오후' : '오전';
                return `${ampm} ${hours % 12 === 0 ? 12 : hours % 12}시 ${minutes.toString().padStart(2, '0')}분`;
            };
            const range = `${formatTime(current)} ~ ${formatTime(next > endTime ? endTime : next)}`;
            ranges.push(range);
            current = next;
        }
        return ranges;
    };

    //미리보기 영역 x 아이콘 이벤트
    const handleRemoveItem = (item) => {
        setSelectedList(prev => prev.filter(i => !(i.type === item.type && i.id === item.id)));
    };

    //Drag and Drop 핸들러
    const handleDrop = (rowIndex, colIndex, item) => {
        setTimetable((prev) => {
            const updated = { ...prev };
            if (!updated[rowIndex]) updated[rowIndex] = {};
            updated[rowIndex][colIndex] = item;
            return updated;
        });
    };

    const getRowIndexFromTime = (baseStartTime, timeStr) => {
        const [hour, minute] = timeStr.slice(0, 5).split(':').map(Number); // "18:00:00" → "18:00"
        const [baseHour, baseMin] = baseStartTime.slice(0, 5).split(':').map(Number);
        const totalMinutes = (hour - baseHour) * 60 + (minute - baseMin);
        return Math.floor(totalMinutes / 60);
    };

    //종류 선택 값에 따라 오른쪽에 테이블 생성
    const handleSelectChange = (e) => {
        const value=Number(e.target.value);
        setDaySort(value);
        let days= [];
        switch (value) {
            case 1:
                days=[{label:'토요일',value:6}];
                break;
            case 2:
                days=[{label:'토요일',value:6},{label:'일요일',value:0}];
                break;
            case 5:
                days=[{label:'월요일',value:1},{label:'화요일',value:2},{label:'수요일',value:3},{label:'목요일',value:4},{label:'금요일',value:5}];
                break;
            case 6:
                days=[{label:'월요일',value:1},{label:'화요일',value:2},{label:'수요일',value:3},{label:'목요일',value:4},{label:'금요일',value:5},{label:'토요일',value:6}];
                break;
            case 7:
                days=[{label:'월요일',value:1},{label:'화요일',value:2},{label:'수요일',value:3},{label:'목요일',value:4},{label:'금요일',value:5},{label:'토요일',value:6},{label:'일요일',value:0}];
                break;  
            default:
                days=[];
        }
        setDayList(days);
    }

    //timecontents 테이블 안에 있는 dayOfWeek 값으로 rightContainer에 표 노출하기 위함
    const convertLabelToDayOfWeek = (label) => {
        const map = {
            '월요일': 1,
            '화요일': 2,
            '수요일': 3,
            '목요일': 4,
            '금요일': 5,
            '토요일': 6,
            '일요일': 0
        };
        return map[label] || 0;
    };

    //선택해온 timetableId 기준으로 내용 넣기
    useEffect(()=>{
        if (!timetableId) return;

        axios.get(`/public/timetable/${timetableId}/detail`)
            .then(res=>{
                const data = res.data;

                setTitle(data.title);
                setDaySort(data.daySort);
                setStartDate(data.startDate);
                setEndDate(data.endDate);  
                
                setDayList(
                    data.dayList.map(day=>{
                        if(typeof day==='string'){
                            return{label:day, value: convertLabelToDayOfWeek(day)};
                        }
                        return day;
                    })
                );

                //가장 이른 startTime / 가장 늦은 endTime 계산
                const timeList= data.contents.map(c=>({
                    start:c.startTime,
                    end: c.endTime
                }));
                const sortedStart = [...timeList].sort((a, b) => a.start.localeCompare(b.start));
                const sortedEnd = [...timeList].sort((a, b) => b.end.localeCompare(a.end));
                setStartTime(sortedStart[0].start); // 가장 빠른 startTime
                setEndTime(sortedEnd[0].end);       // 가장 늦은 endTime

                //중복 없는 classId 기준 className 목록 미리보기 
                const uniqueClasses = new Map(); // classId => className
                data.contents.forEach(item=>{
                    if(item.classId&&!uniqueClasses.has(item.classId)){
                        uniqueClasses.set(item.classId, item.className);
                    }
                });

                const classListPrev=Array.from(uniqueClasses).map(([id,name])=>({
                    id: id.toString(),
                    label:name,
                    type: 'CLASS'
                }));
                setSelectedList(classListPrev);

                const timetableMap={};
                data.contents.forEach(item=>{
                    const { dayOfWeek, classId, className, description, type } = item; //startTime 값 제거: 미사용
                    
                    const rowIndex = getRowIndexFromTime(sortedStart[0].start, item.startTime);
                    const colIndex = dayOfWeek;
                    // rowIndex, colIndex는 없기 때문에 시간과 요일로 매핑 직접 구현 필요
                    // 예시로는 description 중심으로만 매핑 (단순 예)
                    const cellItem ={
                        type: type,
                        label: className|| description,
                        description,
                        id: classId
                    };

                    if(!timetableMap[rowIndex]) timetableMap[rowIndex] = {};
                    timetableMap[rowIndex][colIndex] =cellItem;
                });
                setTimetable(timetableMap);
            })
            .catch(err=>{
                console.error("시간표 상세 조회 실패:",err);
            }); 
    },[timetableId]);

    // 클래스 선택 이벤트
    const handleClassChange=(e)=>{
        const selectedId = e.target.value;
        setSelectedClassValue(selectedId);

        const selectedObj = classList.find(c => c.id.toString() === selectedId);
        if (!selectedObj) return;
    
        // 중복 선택 방지
        if (selectedList.find(item => item.type === 'CLASS' && item.id === selectedId)) return;
        setSelectedList(prev => [...prev, { type: 'CLASS', id: selectedId, label: selectedObj.name }]);
    }

    //수정하기 버튼 이벤트
    const handleUpdateTimetable = ()=>{
        //시간표에 들어갈 contents 리스트 생성
        const contentsDtoList=[];

        Object.keys(timetable).forEach(rowIndex=>{
            Object.keys(timetable[rowIndex]).forEach(colIndex=>{
                const item=timetable[rowIndex][colIndex];
                if(!item) return;

                const start = new Date(`2000-01-01T${startTime}`);
                start.setHours(start.getHours()+parseInt(rowIndex));//rowIndex 기준 시간 증가
                const end = new Date(start);
                end.setHours(start.getHours()+1);

                const formatTime=(date)=>date.toTimeString().substring(0,8);//HH:mm:ss

                contentsDtoList.push({
                    startTime:formatTime(start),
                    endTime:formatTime(end),
                    classId:item.id,
                    dayOfWeek: parseInt(colIndex),
                    description: item.description,
                    type: item.type
                });
            });
        });
        const dto ={
            academyId:acaId,
            type,
            title,
            daySort,
            startDate,
            endDate,
            contentsDtoList
        };

        axios.put(`/public/updateTimetab/${timetableId}`, dto, { withCredentials: true })
        .then(res=>{
            alert('시간표가 수정되었습니다.');
            navigate('../timetable'); //수정 완료 후 시간표 목록 페이지 이동

        }).catch (err=>{
            console.err("시간표 수정 실패:",err);
            alert("시간표 수정 중 오류가 발생했습니다.");
        });
    };

    return (
        <div className='attendContainer'>
                    {/* 시간표 생성 영역 =========================================== */}
                    <div className='TimeTab-leftContainer'>
                        <span className='attendTitle'> 시간표 편집 </span>
                        
                        <div className='createWrapper'>
                            {/* 구성요소 제목 영역 */}
                            <div className='createTitle'>
                                <span> 제목 </span>
                                <span> 종류 </span>
                                <span> 구분 </span>
                                <span className={`createTitle-class ${sort === "TEACHER" ? 'hidden' : ''}`}> 수업 </span>
                                <span className={`createTitle-teacher ${sort === "CLASS" ? 'hidden' : ''}`}> 선생님 </span>
                                <span> 시간 </span>
                                <span> 적용 </span>
                            </div>
        
                            <div className='createContent'>
                                {/* 내용 설정 영역 (왼) */}
                                <div className='contentRow'>
                                    <input type='text' value={title} onChange={(e)=>setTitle(e.target.value)}/>
                                    <select className='TimeTabConCon-daySelect' name={daySort} value={daySort}
                                    onChange={handleSelectChange}>
                                        <option value=''>선택하세요.</option>
                                        <option value='1'>토요일(1일)</option>
                                        <option value='2'>토요일 ~ 일요일(2일)</option>
                                        <option value='5'>월요일 ~ 금요일(5일)</option>
                                        <option value='6'>월요일 ~ 토요일(6일)</option>
                                        <option value='7'>월요일 ~ 일요일(7일)</option>
                                    </select>
                                    <div className='TimeTabConCon-Sort'>
                                        <label>
                                            <input type="radio" name="sort" value="CLASS" checked={sort==="CLASS"}
                                            onChange={(e) => setSort(e.target.value)} />
                                            &nbsp;&nbsp;<b>반</b>
                                        </label>
                                        {/* <label>
                                            <input type="radio" name="sort" value="TEACHER" checked={sort==="TEACHER"}
                                            onChange={(e) => setSort(e.target.value)}/>
                                            &nbsp;&nbsp;<b>강사</b>
                                        </label> */}
                                    </div>
                                    <div>
                                        <select value={selectedClassValue}
                                        onChange={handleClassChange}
                                        className={`TimeTabConCon-class ${sort === "TEACHER" ? 'hidden' : ''}`}>
                                            <option value="">반 선택</option>
                                            {classList.map(c=>(
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* <div>
                                        <select value={selectedTeacherValue} onChange={handleTeacherChange} className={`TimeTabConCon-teacher ${sort === "CLASS" ? 'hidden' : ''}`}>
                                            <option value="">선생님 선택</option>
                                            {teacherList.map(teacher=>(
                                                <option key={teacher.teacherId} value={teacher.teacherId}>
                                                    {teacher.teacherName} ({teacher.subject})
                                                </option>
                                            ))}
                                        </select>
                                    </div> */}
                                    <div className='TimeTabConCon-time'>
                                        <input type='time' className='TimeTabConCon-startTime' value={startTime} onChange={handleStartTimeChange}/>
                                        <input type='time' className='TimeTabConCon-endTime' value={endTime} onChange={handleEndTimeChange}/>
                                    </div>
                                    <div className='TimeTabConCon-date'>
                                        <input type='date' className='TimeTabConCon-startDate' value={startDate} onChange={(e)=> setStartDate(e.target.value)}/>
                                        <input type='date' className='TimeTabConCon-endDate' value={endDate} onChange={(e)=>setEndDate(e.target.value)}/>
                                    </div>
                                    <hr/>
                                    <div className="TimeTabCon-preview">
                                        {selectedList.map((item, index) => (
                                            <div className="TimeTabPre" key={`${item.type}-${item.id}`}
                                            draggable
                                            onDragStart={(e)=>{
                                                e.dataTransfer.setData("text/plain",JSON.stringify(item));
                                            }}>
                                                <span>{item.label}</span>
                                                <i className="bi bi-x-lg" onClick={() => handleRemoveItem(item)}></i>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type='button' className='TimeTabAddBtn' onClick={handleUpdateTimetable}>수정하기</button>
                    </div>
        
                    {/* 시간표 미리보기 ============================================ */}
                    <div className='TimeTab-rightContainer'>
                        <div className="createTimeTabContents">
                            
                            <table className='timeTable'>
                                <thead>
                                    <tr>
                                        <th width="150px">시간</th>
                                        {dayList.map((day, index) => (
                                            <th key={index}>{day.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {startTime && endTime && dayList.length > 0 ? (
                                    getTimeRanges(startTime, endTime).map((range, rowIndex) => (
                                        <tr key={rowIndex}>
                                            <td>{range}</td>
                                            {dayList.map((dayObj, colIndex) => {
                                                const dayOfWeek = dayObj.value;
                                                return (
                                                 <td key={colIndex}
                                                    onClick={() => {
                                                        const currentItem = timetable[rowIndex]?.[dayOfWeek];
                                                        if (!currentItem) {
                                                            setEditingCell({ rowIndex, colIndex: dayOfWeek });
                                                            setEditingText('');
                                                        }
                                                    }}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
                                                        handleDrop(rowIndex, dayOfWeek, data); 
                                                    }}
                                                >
                                                  {editingCell?.rowIndex === rowIndex && editingCell?.colIndex === dayOfWeek ? (
                                                    <input type="text" autoFocus value={editingText}
                                                        onChange={(e) => setEditingText(e.target.value)}
                                                        onBlur={() => {
                                                          if (editingText.trim()) {
                                                            const newItem = {
                                                                type: 'TEXT',
                                                                label: editingText.trim(),
                                                                description: editingText.trim(),
                                                                id: null
                                                            };
                                                            handleDrop(rowIndex, dayOfWeek, newItem);
                                                        }
                                                        setEditingCell(null);
                                                        setEditingText('');
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.target.blur(); // blur 처리로 저장
                                                        }
                                                    }}
                                                />
                                            ) : timetable[rowIndex]?.[dayOfWeek] ? (
                                                <div className="TimeTabCellContent">
                                                     <span>{timetable[rowIndex][dayOfWeek].label}</span>
                                                    <i className="bi bi-x-lg TimeTabCellRemove"
                                                        onClick={() =>setTimetable((prev) => {
                                                            const updated = { ...prev };
                                                            if (updated[rowIndex]) {
                                                                delete updated[rowIndex][dayOfWeek]; 
                                                            }
                                                            return { ...updated };
                                                        })
                                                        }
                                                    ></i>
                                                </div>
                                            ) : null}
                                            </td>
                                                )
                                            })}
                                        </tr>
                                    ))
                                ):(
                                    <tr>
                                        <td colSpan={dayList.length + 1} style={{ textAlign: 'center' }}>
                                            시작시간과 종료시간을 선택해주세요.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
    );
};

export default UpdateTimetable;