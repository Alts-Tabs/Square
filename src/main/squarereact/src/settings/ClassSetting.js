import React, { useCallback, useEffect, useState } from 'react';
import '../attendBook/attend.css';
import './classSetting.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClassSetting = () => {
    const {acaId} = useParams();
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    // 필터링 추가
    const [filteredTeacherId, setFilteredTeacherId] = useState('');

    // 클래스 목록 함수
    const fetchClassList = useCallback(() => {
        axios.get(`/th/${acaId}/classes`, {withCredentials: true})
            .then(res => setClasses(res.data))
            .catch(err => alert("클래스 목록 로딩 실패", err));
    }, [acaId]);

    // form 입력 상태
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('30');
    const [teacherId, setTeacherId] = useState('');

    useEffect(() => {
        if(!acaId) {
            return;
        }

        // 학원 강사 목록 불러오기
        axios.get(`/dir/${acaId}/teachers`, {
            withCredentials: true,
        }).then(res => setTeachers(res.data))
        .catch(err => {
            alert("Failed load Teachers", err);
        });

        // 클래스 목록
        fetchClassList();

    }, [acaId, fetchClassList]);

    // 삭제 함수 추가
    const handleDeleteClass = (classId) => {
        if(!window.confirm("정말 이 클래스를 삭제하시겠습니까?")) {
            return;
        }

        axios.delete(`/dir/${classId}/delete`, {withCredentials: true})
            .then(() => {
                setClasses(prev => prev.filter(cls => cls.id !== classId));
            }).catch(err => alert("클래스 삭제 실패", err));
    }

    // 담당자 선택 이벤트
    const [selectedTeacherName, setSelectedTeacherName] = useState('');
    const handleTeacherChange = (e) => {
        const selectedId = e.target.value;
        setTeacherId(e.target.value);

        const selected = teachers.find(t => t.teacherId.toString() === selectedId);
        if(selected) {
            setSelectedTeacherName(`${selected.teacherName} (${selected.subject})`);
        } else {
            setSelectedTeacherName('');
        }
    }

    // 클래스 생성 요청
    const handleCreateClass = () => {
        if(!name || !teacherId) {
            alert("클래스명과 담당자를 입력!");
            return;
        }

        axios.post("/dir/createClass", {
            name: name,
            capacity: capacity ? parseInt(capacity, 10) : null,
            teacherId: parseInt(teacherId, 10)
        }, {withCredentials: true})
        .then(res => {
            alert(`클래스 생성 완료: ${res.data.name} (ID: ${res.data.id})`);
            setName('');
            setCapacity('30');
            setTeacherId('');
            setSelectedTeacherName('');
            fetchClassList(''); // 목록 갱신
        }).catch(err => {
            alert("클래스 생성 실패: ", err);
        });
    }



    return (
        <div className='attendContainer'>
                {/* 왼쪽 영역 */}
                <div className='leftContainer'>
                <span className='attendTitle'> 클래스 관리 </span>

                <div className='listHeader'>
                    <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>
                        클래스 목록
                    </span>

                    <select className='classFilter' value={filteredTeacherId}
                     onChange={(e) => setFilteredTeacherId(e.target.value)}>
                        <option value=''> 클래스 필터 </option>
                        {teachers.map((teacher) => (
                            <option key={teacher.teacherId} value={teacher.teacherId}>
                                {teacher.teacherName} ({teacher.subject})
                            </option>
                        ))}
                    </select>
                </div>

                <div className='listBody'>
                    {/* 이하 반복되는 클래스 리스트 ======================================== */}
                    {classes.filter(cls => {
                        if(!filteredTeacherId) return true;
                        return cls.teacherId === parseInt(filteredTeacherId, 10);
                    }).map(cls => (
                    <div className='listContent' key={cls.id}>
                        <div className='classPhoto'></div> {/* 여기에 이미지 업로드 */}
                        <div className='classInfo'>
                            <span style={{ fontSize: '22px', color: '#2E5077', fontWeight: '700' }}>
                                {cls.name} &nbsp;&nbsp;
                                <span style={{ fontSize: '20px', color: '#2E5077', fontWeight: '500' }}> 
                                    {cls.teacherName}
                                </span>
                            </span>
                            <span style={{ fontSize: '22px', color: '#2E5077', fontWeight: '700' }}>
                                [현재 인원] &nbsp;&nbsp; {cls.currentCount}/{cls.capacity}
                            </span>
                        </div>

                        <div className='classDelete'> {/* 삭제 버튼 */}
                            <button onClick={() => handleDeleteClass(cls.id)}> 삭제 </button>
                        </div>
                    </div>
                    ))}
                    {/* ===================================================================== */}
                </div>
            </div>


            {/* 오른쪽 영역 */}
            <div className='rightContainer'>
                <div className='createClassHeader'>
                    <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>
                        클래스 생성
                    </span>
                </div>

                <div className='createClassBody'>
                    <span className='createGrayText'> 이름 </span>
                    <input type='text' value={name}
                     onChange={(e) => setName(e.target.value)}></input>
                    <br /><br />

                    <span className='createGrayText'> 정원 </span>
                    <input type='number' value={capacity}
                     onChange={(e) => setCapacity(e.target.value)}></input>
                    <br /><br />

                    <span className='createGrayText'> 담당자 </span>
                    <input type='text' readOnly value={selectedTeacherName}
                     placeholder='선택한 담당자가 표시됩니다.'></input>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <select className='classFilter' value={teacherId}
                     onChange={handleTeacherChange}>
                        <option value={''}> 담당자 선택 </option>
                        {teachers.map((teacher) => (
                            <option key={teacher.teacherId} value={teacher.teacherId}>
                                {teacher.teacherName} ({teacher.subject})
                            </option>
                        ))}
                    </select>
                    <br /><br />     

                    {/* 생성 버튼 */}
                    <button onClick={handleCreateClass}> 생성 </button>
                </div>
            </div>
        </div>
    );
};

export default ClassSetting;