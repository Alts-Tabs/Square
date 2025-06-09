import React, { useEffect, useState } from 'react';
import './EvaluationsParents.css';
import axios from 'axios';
const EvaluationsParents = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [subjects, setSubjects]=useState([]);
    const [evalData, setEvalData] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [role, setRole] = useState('');

    //토큰에서 userId를 뽑아서 학생 목록 노출시키기
    useEffect(()=>{
        //로그인한 사용자(userId) 가져오기
        axios.get('/public/user', {withCredentials:true})
            .then(res=>{
                const {userId, role} = res.data;
                setRole(role);
                
                if (role !== "학부모") {
                    //alert("학부모 계정만 조회 가능합니다.");
                    return; // 여기서 바로 종료
                }

                //userId로 parentId 조회
                return axios.get(`/parent/getParentId`,{params:{userId}, withCredentials:true})
            })
            .then(res => {
                const parentId = res.data;
                //parentId로 학생 목록 조회
                return axios.get(`/parent/students`, {params:{parentId},withCredentials:true});
            })
            .then(res =>{
                setStudents(res.data);
                //console.log("학생 데이터 확인:", res.data);
            })
            .catch(err=>console.log(err));
    },[]);

    //과목 목록 노출시키기
    useEffect(()=>{
        if(!selectedStudent){
            setSubjects([]);//학생 선택 안하면 과목 목록 비우기
            return;
        }
        //console.log("선택된 학생 ID:", selectedStudent);
        if (role !== "학부모") {
            //console.log("학부모 계정이 아니므로 과목 조회 안 함");
            return;
        }


        axios.get(`/parent/evalStuSubject`,{params:{studentId: selectedStudent},withCredentials:true})
            .then(res=>{
                setSubjects(res.data); //TeacherDto 리스트 노출시키기
            })
            .catch(err=>console.log(err));
    },[selectedStudent,role]);

    //조회 버튼 이벤트
    const handelSearchParentsEval=()=>{
        if (role !== "학부모") {
            alert("학부모 계정만 조회 가능합니다.");
            return;
        }
        
        const startDate = document.querySelector('.evalP-StartDate').value;
        const endDate = document.querySelector('.evalP-EndDate').value;

        if(!selectedStudent){
            alert("학생을 선택해주세요.");
            return;
        }

        axios.get("/parent/evalParentSearch",{
            params: {
                studentId: selectedStudent,
                subject: selectedSubject || null,
                period: selectedPeriod || null,
                startDate: startDate || null,
                endDate: endDate || null
            },
            withCredentials:true
        })
        .then(res=>{
            setEvalData(res.data);
            //console.log("조회 결과:", res.data);
        })
        .catch(err => console.log(err));
    };

    return (
        <div className='evaluationpContainer'>
            <div className='evalp-topContainer'>
                <h2 className='evalTitle'>종합 평가</h2>
                <div className='evalp-selectInfo'>
                    <table>
                        <tr>
                            <th>학생</th>
                            <td colSpan='3'>
                                <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
                                    <option value="">학생를 선택하세요.</option>
                                    {students.map(student=>(
                                        <option key={student.studentId} value={student.studentId}>
                                            {student.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th >과목</th>
                            <td>
                                <select value={selectedSubject} onChange={e=>setSelectedSubject(e.target.value)}>
                                    <option value=""> 과목을 선택하세요.</option>
                                    {subjects.map((subject,index)=>(
                                        <option key={index} value={subject.subject}>
                                            {subject.subject}({subject.teacherName})
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <th>종류</th>
                            <td>
                                <select value={selectedPeriod} onChange={e=> setSelectedPeriod(e.target.value)}>
                                    <option value="">평가 종류 선택</option>
                                    <option value={'WEEKLY'}>주간평가</option>
                                    <option value={'MONTHLY'}>월 평가</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>시작</th>
                            <td>
                                <input type="date" className='evalP-StartDate'/>
                            </td>
                            <th>종료</th>
                            <td>
                                <input type="date" className='evalP-EndDate'/>
                                <button type='button' className='evalP-Searchbtn' onClick={handelSearchParentsEval}>
                                    조회
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>

            </div>
            <div className='evalp-listContainer'>
                <table className='evalp-listTable'>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>과목</th>
                        <th>점수</th>
                        <th>내용</th>
                        <th>저장 날짜</th>
                      </tr>
                    </thead>
                    <tbody>
                        {evalData.length===0? (
                            <tr>
                                <td colSpan="5" style={{textAlign:'center'}}>조회된 데이터가 없습니다.</td>
                            </tr>
                        ):(
                        evalData.map((data,index)=>(
                            <tr key={index}>
                                <td>{index+1}.</td>
                                <td>{data.subject}</td>
                                <td>{data.score}</td>
                                <td>{data.contents}</td>
                                <td>{data.created_at}</td>
                            </tr>
                        ))    
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default EvaluationsParents;