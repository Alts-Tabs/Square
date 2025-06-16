import React, { useEffect, useState } from 'react';
import './TotalEvaluationsAdmin.css';
import axios from 'axios';

const TotalEvaluationsAdmin = () => {
    //저장 버튼 클릭 시 필요한 변수들
    const [selectSubject, setSelectSubject]=useState('');
    const [selectPeriod, setSelectPeriod]=useState('');
    const [startDate, setStartDate] =useState('');
    const [endDate, setEndDate]=useState('');
    const [score, setScore]=useState('');
    const [contents, setContents]=useState('');
    const [teacherId,setTeacherId]=useState(null);
    //왼쪽 메뉴에서 학생 선택 시 필요
    const[selectStudentId, setSelectStudentId]=useState(null);
    const [selectStudentName, setSelectStudentName] = useState('');
    // const handleSelectStudent=(name)=> setSelectStudentName(name);
    const [student, setStudent]=useState([]);
    //const [checkStudent,setCheckStudent]=useState([]);
    //로그인한 계정이 담당하는 과목
    const [subject,setSubject]=useState([]);
    const [role, setRole] = useState('');  // 역할 저장용
    const [acaId, setAcaId] = useState(''); // academyId 저장
    const [classList, setClassList] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    
    //저장 버튼 이벤트
    const handleSaveEvaluation=()=>{
        if (role === "관리자" || role === "원장") {
            alert("강사 계정으로 로그인 부탁드립니다.");
            return;
        }
        //const selectStudentId = Object.keys(checkStudent).find(key => checkStudent[key]);
        if(!selectStudentId) return alert('선택된 학생이 없습니다.');
        if(!selectSubject) return alert('과목을 선택해주세요.');
        if(!selectPeriod) return alert('평가 종류를 선택해주세요.');
        if(!startDate) return alert('시작 날짜를 선택해주세요.');
        if(!endDate) return alert('종료 날짜를 선택해주세요.');
        if(!score||isNaN(score)) return alert('점수를 입력해주세요.');
        if(!contents.trim()) return alert('평가 내용을 입력해주세요.');
        

    const requestBody={
        studentId:parseInt(selectStudentId),//선택된 학생의 id
        teacherId:teacherId,
        subject: selectSubject,
        score:parseInt(score),
        startDate:startDate,
        endDate: endDate,
        contents:contents
    };

    axios.post(`/th/insertEvaluation`,requestBody,{params: {period:selectPeriod}, withCredentials:true})
        .then(()=>{
            alert('평가 등록 완료');
            window.location.reload();
        }).catch(err =>{
            console.log(err);
            alert('저장 중 오류가 발생했습니다.');
        });
    };//저장 버튼 이벤트 종료
    
    useEffect(() => {
    // 로그인한 userId, role 받아오기
    axios.get(`/public/user`, { withCredentials: true })
        .then(response => {
            const { userId, role, acaId } = response.data;
            setRole(role); 
            setAcaId(acaId);

            if (role === "강사") {
            return axios.get(`/public/teacher/getTeacherId`, { params: { userId } })
                .then(teacherResponse => {
                    const teacherId = teacherResponse.data;
                    setTeacherId(teacherId);
                    return axios.get(`/public/teacher/subjects`, { params: { role, userId } });
                });
            } else {
                // 강사 아닐 때는 teacherId 필요 없음, 바로 과목 요청
                return axios.get(`/public/teacher/subjects`, { params: { role, userId } });
            }
        })
        .then(subjectResponse => {
            setSubject(subjectResponse.data);
        })
        .catch(error => console.error(error));

    }, []);

    useEffect(() => {
        //강사면 teacherId까지 준비된 후 실행, 아니면 acaId만 있으면 실행
        if ((role === "강사" && !teacherId) || !acaId) return;

        axios.get(`/th/${acaId}/classes`, { withCredentials: true })
            .then(res =>{
                 setClassList(res.data);

                 //TEACHER일 경우, 본인 teacherId에 해당하는 class 선택
                 if (role === "강사" && teacherId) {

                    const teacherClass = res.data.find(cls => String(cls.teacherId) === String(teacherId));

                    if (teacherClass) {
                        setSelectedClassId(teacherClass.id.toString());
                    } else {
                        console.warn("해당 teacherId로 된 class를 찾지 못함.");
                    }
                }
            })
            .catch(err => console.error(err));
    }, [acaId,role,teacherId]);

    useEffect(()=>{
        if(!selectedClassId) return;

        axios(`/th/${selectedClassId}/students`, {withCredentials:true})
        .then(res=>setStudent(res.data))
        .catch(err=>console.error(err));
    },[selectedClassId])

    //학생 목록 체크박스 이벤트
    const toggleStudentSelection = (stuId, stuName) => {
        const id = Number(stuId);  // 여기서 무조건 숫자로
        if (selectStudentId === id) {
            setSelectStudentId(null);
            setSelectStudentName('');
        } else {
            setSelectStudentId(id);
            setSelectStudentName(stuName);
        }
    };

    return (
        <div className='evaluationContainer'>
            <div className='eval-leftContainer'>
                <h2 className='evalTitle'>종합 평가</h2>
                <div className='eval-classSelect'>
                    <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
                        <option value="">클래스 선택</option>
                        {classList.map(cls=>(
                            <option key={cls.id} value={cls.id}>
                                {cls.name}({cls.teacherName})
                            </option>
                        ))}
                    </select> &nbsp;&nbsp;
                    <span style={{fontSize:'20px', color:'#2E5077', fontWeight:'800'}}>
                        {selectedClassId
                            ? `${classList.find(cls => cls.id.toString() === selectedClassId)?.name || '클래스명'}`
                        : ''}
                    </span>
                </div>

                <div className='eval-classContents'>
                    <table className='evalA-StudentList'>
                        <thead className='evalA-thead'>
                          <tr>
                            <th style={{width:'100px',fontSize:'20px'}}>
                                선택
                            </th>
                            <th style={{fontSize:'20px',width:'200px'}}>
                                학생명
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                            {selectedClassId===''? (
                                <tr>
                                    <td colSpan={2} style={{textAlign:'center', fontSize:'18px', color:'rgba(125, 138, 138, 0.8)'}}>
                                        클래스를 선택해주세요.
                                    </td>
                                </tr>
                            ):(
                            student.length === 0? (
                                <tr>
                                    <td colSpan={2} style={{textAlign:'center', fontSize:'18px', color:'#2E5077', fontWeight:500}}>
                                        해당 클래스에 학생이 없습니다.
                                    </td>
                                </tr>    
                            ):(
                            student.map((stu)=>(
                                <tr key={stu.studentId}>
                                    <td>
                                        <label className="custom-checkbox-evalAdmin">
                                            <input type='checkbox' data-student-id={stu.studentId} style={{ display: 'none' }}
                                            checked={selectStudentId === stu.studentId} onChange={() => toggleStudentSelection(stu.studentId, stu.name)} />
                                            <span></span>
                                        </label>
                                    </td>
                                    <td className='studentName' onClick={() => toggleStudentSelection(stu.studentId, stu.name)}
                                        style={{cursor:'pointer'}}>
                                    {stu.name}
                                    </td>
                                </tr>
                            ))
                            )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='eval-rightContainer'>
              <h2 style={{visibility: 'hidden'}}>영역확보</h2>
                <div className='eval-rightTitle'>
                    <div className='rightStudentName' style={{ fontSize: '23px', color: '#2E5077', fontWeight: '800' }}>
                        {selectStudentName ? selectStudentName : '선택된 학생 없음'}
                    </div>
                    <div className='rightTitleLabel' style={{ marginTop: '4px' }}>
                        종합 평가
                    </div>
                </div>

                
                <div className='evaluationContent'>
                  <div className='evaluationHeader'>
                    <select className='evaluSelect'
                        value={selectSubject} onChange={(e)=>setSelectSubject(e.target.value)}>
                        {selectSubject === '' && <option>과목 선택</option>}
                        {Array.isArray(subject) && subject.map((subj, index) => (
                            <option key={index} value={subj.subject}>{`${subj.subject} (${subj.teacherName})`}</option>
                        ))}
                    </select>

                    <select className='evaluSelect'
                        value={selectPeriod} onChange={(e)=>setSelectPeriod(e.target.value)}>
                        {selectPeriod === '' && <option>평가 종류 선택</option>}
                        <option value={'WEEKLY'}>주간평가</option>
                        <option value={'MONTHLY'}>월 평가</option>
                    </select>

                    <div  className='evalA-StartDate'>
                        <label className='evalA-start'>시작 날짜</label> &nbsp;
                        <input type='date' className='evalA-Date'
                            value={startDate} onChange={(e)=>setStartDate(e.target.value)}/>
                    </div>&nbsp;
                    <div className='evalA-endDate'>
                        <label className='evalA-end'>종료 날짜</label> &nbsp;
                        <input type='date' className='evalA-Date'
                            value={endDate} onChange={(e)=>setEndDate(e.target.value)}/>
                    </div>
                    <button  type='button' className='saveEval' onClick={handleSaveEvaluation}>
                        저장
                    </button>  
                  </div>

                  <div className='evaluationBody'>
                    <span> 점수 </span>
                    <input type='number' min="0" max="100"
                        value={score} onChange={(e)=>setScore(e.target.value)}
                        onBlur={() => {
                            let num = parseInt(score);
                            if (isNaN(num) || num < 1) num = 1;
                            if (num > 100) num = 100;
                            setScore(num);}}
                    />
                    <div className="evaluationRow">
                        <span> 평가 작성 </span>
                        <textarea
                        placeholder='평가 내용을 입력해주세요.'
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                        />
                    </div>
                  </div>
                </div>
            </div>

        </div>
    );
};

export default TotalEvaluationsAdmin;