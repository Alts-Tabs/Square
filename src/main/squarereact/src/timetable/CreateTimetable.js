import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../attendBook/attend.css';
import '../settings/classSetting.css';
import './timetable.css';
import './createTimetable.css'; 
import { useLocation } from 'react-router-dom';
import { type } from '@testing-library/user-event/dist/type';

const CreateTimetable = () => {
    const [userInfo, setUserInfo] = useState({name: '', role: '', username: '', acaId: '', userId: ''});
    const [selectedClassValue, setSelectedClassValue] = useState('');
    //const [selectedTeacherValue, setSelectedTeacherValue] = useState('');
    const [selectedList, setSelectedList] = useState([]);
    const location = useLocation();
    const acaId = location.state?.acaId;
    const [title, setTitle] = useState('');
    const [classList, setClassList]=useState([]);
    //const [teacherList, setTeacherList]=useState([]);
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
    
    useEffect(()=>{
        axios.get("/public/user",{withCredentials:true})
        .then(res=>{
            const {name, role, username,acaId,userId}=res.data;
            setUserInfo({name,role,username,acaId,userId});
        })
        .catch(err=>{
            console.error("사용자 정보 가져오기 실패:",err);
        });
    },[]);

    //종류 선택 값에 따라 오른쪽에 테이블 생성
    const handleSelectChange = (e) => {
        const value=Number(e.target.value);
        setDaySort(value);
        let days= [];
        switch (value) {
            case 1:
                days=['토요일'];
                break;
            case 2:
                days=['토요일','일요일'];
                break;
            case 5:
                days=['월요일','화요일','수요일','목요일','금요일'];
                break;
            case 6:
                days=['월요일','화요일','수요일','목요일','금요일','토요일'];
                break;
            case 7:
                days=['월요일','화요일','수요일','목요일','금요일','토요일','일요일'];
                break;  
            default:
                days=[];
        }
        setDayList(days);
    }

    //구분 라디오버튼 선택에 따른 
    const handleSortChange = (e) => {
        setSort(e.target.value);
        setSelectedList([]); // 미리보기 리스트 초기화
    };
    
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

    //선생님 목록 노출
    // useEffect(()=>{
    //     if(!acaId) return;
    //     axios.get("/public/getTeachersByacaId",{
    //         params:{acaId},
    //         withCredentials:true
    //     })
    //     .then(res=>{
    //         //console.log("선생님 목록 데이터:", res.data);
    //         setTeacherList(res.data);
    //     })
    //     .catch(err=>{
    //         console.error("선생님 목록 불러오기 실패:",err);
    //     });
    // },[acaId]);

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

    // 클래스 선택 이벤트
    const handleClassChange=(e)=>{
        const selectedId = e.target.value;
        setSelectedClassValue('');
        const selectedObj = classList.find(c => c.id.toString() === selectedId);
        if (!selectedObj) return;

        // 중복 선택 방지
        if (selectedList.find(item => item.type === 'CLASS' && item.id === selectedId)) return;
        setSelectedList(prev => [...prev, { type: 'CLASS', id: selectedId, label: selectedObj.name }]);
    }

    // 선생님 선택 이벤트
    // const handleTeacherChange=(e)=>{
    //     const selectedId = Number(e.target.value);
    //     setSelectedTeacherValue('');
    //     const selectedObj = teacherList.find(t => t.teacherId === selectedId);
    //     if (!selectedObj) return;

    //     if (selectedList.find(item => item.type === 'TEACHER' && item.id === selectedId)) return;
    //     setSelectedList(prev => [
    //         ...prev, 
    //         { type: 'TEACHER', id: selectedId, label: `${selectedObj.teacherName} (${selectedObj.subject})` }
    //     ]);
    // }
    
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

    //starTime, endTime 저장 시 필요한 내용
    const getTimeByRowIndex = (baseStartTime, index) => {
        const [h, m] = baseStartTime.split(':').map(Number); // 예: '17:00' → 17, 0
        const start = new Date(0, 0, 0, h + index, m);        // 시작 시간 + rowIndex시간
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 시작 + 1시간

        const toHHMM = (date) =>{
            const hh = date.getHours().toString().padStart(2, '0');
            const mm = date.getMinutes().toString().padStart(2, '0');
            return `${hh}:${mm}:00`; // 초는 항상 00
        };
        return {
            startTime: toHHMM(start), // "17:00"
            endTime: toHHMM(end)      // "18:00"
        };
    };

    //시간표 저장 핸들러
    const handlesaveTimetable=()=>{
        if(!startDate||!endDate||!startTime||!endTime||selectedList.length === 0 || Object.keys(timetable).length===0) {
            alert("필수 정보를 모두 입력해주세요.")
            return;
        }

        const contentsDtoList =[];
        Object.entries(timetable).forEach(([rowIndex,cols])=>{
            Object.entries(cols).forEach(([colIndex,item])=>{
                const { startTime: cellStartTime, endTime: cellEndTime } = getTimeByRowIndex(startTime, Number(rowIndex));
                contentsDtoList.push({
                    classId:Number(item.id),
                    startTime:cellStartTime,
                    endTime:cellEndTime,
                    type:item.type||sort,
                });
            });
        });

        const payload={
            academyId: userInfo.acaId,
            userId: userInfo.userId,
            title,
            daySort,
            sort,
            selectedList,
            dayList,
            startTime,
            endTime,
            startDate,
            endDate,
            timetable,
            contentsDtoList 
        };

        //console.log('ACA ID 확인:', userInfo.acaId);
        axios.post("/dir/saveTimetable",payload,{withCredentials:true})
        .then(res=>{
            alert("시간표가 저장되었습니다.");
            //console.log("응답:",res.data);

            setTitle('');
            setSort('CLASS');
            setSelectedList([]);
            setDayList(['토요일']);
            setStartTime('');
            setEndTime('');
            setStartDate('');
            setEndDate('');
            setTimetable({});
            setSelectedClassValue('');
            // setSelectedTeacherValue(''); // teacher 사용 시 주석 해제
        })
        .catch(err=>{
            console.log("시간표 저장 실패:",err);
            alert("저장 중 오류가 발생했습니다.");
        })
    }


    return (
        <div className='attendContainer'>
            {/* 시간표 생성 영역 =========================================== */}
            <div className='TimeTab-leftContainer'>
                <span className='attendTitle'> 시간표 생성 </span>
                
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
                            <select className='TimeTabConCon-daySelect' name="daySort" onChange={handleSelectChange} >
                                <option value='1'>토요일(1일)</option>
                                <option value='2'>토요일 ~ 일요일(2일)</option>
                                <option value='5'>월요일 ~ 금요일(5일)</option>
                                <option value='6'>월요일 ~ 토요일(6일)</option>
                                <option value='7'>월요일 ~ 일요일(7일)</option>
                            </select>
                            <div className='TimeTabConCon-Sort'>
                                <label>
                                    <input type="radio" name="sort" value="CLASS" checked={sort==="CLASS"}
                                    onChange={handleSortChange}/>
                                    &nbsp;&nbsp;<b>반</b>
                                </label>
                                {/* <label>
                                    <input type="radio" name="sort" value="TEACHER" checked={sort==="TEACHER"}
                                    onChange={handleSortChange}/>
                                    &nbsp;&nbsp;<b>강사</b>
                                </label> */}
                            </div>
                            <div>
                                <select value={selectedClassValue} onChange={handleClassChange}
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
                <button type='button' className='TimeTabAddBtn' onClick={handlesaveTimetable}>생성하기</button>
            </div>

            {/* 시간표 미리보기 ============================================ */}
            <div className='TimeTab-rightContainer'>
                <div className="createTimeTabContents">
                    
                    <table className='timeTable'>
                        <thead>
                            <tr>
                                <th width="150px">시간</th>
                                {dayList.map((day, index) => (
                                    <th key={index}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {startTime && endTime && dayList.length > 0 ? (
                            getTimeRanges(startTime, endTime).map((range, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td>{range}</td>
                                    {dayList.map((day, colIndex) => (
                                        <td key={colIndex}
                                        onDragOver={(e)=>e.preventDefault()}//드롭 가능하게 함
                                        onDrop={(e)=>{
                                            e.preventDefault();
                                            const data=JSON.parse(e.dataTransfer.getData("text/plain"));
                                            handleDrop(rowIndex,colIndex,data);
                                        }}>
                                            {timetable[rowIndex]?.[colIndex] ? (
                                                <div className="TimeTabCellContent">
                                                    <span>{timetable[rowIndex][colIndex].label}</span>
                                                    <i className="bi bi-x-lg TimeTabCellRemove"
                                                        onClick={() => {setTimetable((prev) => {
                                                            const updated = { ...prev };
                                                            if (updated[rowIndex]) {
                                                                delete updated[rowIndex][colIndex];
                                                            }
                                                            return { ...updated };
                                                            });
                                                        }}
                                                    ></i>
                                                </div>
                                            ) : ""}
                                        </td>
                                    ))}
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

export default CreateTimetable;