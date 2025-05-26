import React, { useEffect, useState } from 'react';
import './TotalEvaluationsAdmin.css';
import axios from 'axios';

const TotalEvaluationsAdmin = () => {
    const [selectStudent, setSelectStudent]=useState('');
    const handleSelectStudent=(name)=> setSelectStudent(name);
    const [subject,setSubject]=useState([]);
    //const token=localStorage.getItem('token');
    const [student, setStudent]=useState([]);
    const [checkStudent,setCheckStudent]=useState([]);

    useEffect(()=>{
        //로그인한 userId에 해당하는 과목 가져오기
        // axios.get(`/public/user`,{withCredentials:true})
        // .then(respose=>{
        //     const userId=respose.data.userId;
        //     return axios.get(`/teachers/subject?userId=${userId}`);
        // })
        // .then(respose=>{
        //     setSubject(respose.data);
        // })
        // .catch(error=>console.error(error));

        //학생 목록 가져오기 임시로 전체 학생 목록 가져오기
        axios.get(`/studentList`,{withCredentials:true})
            .then(respose=>{
                setStudent(respose.data);
            })
            .catch(error=>console.error(error));
        
    },[]);

    //학생 목록 체크박스 이벤트
    const toggleStudentSelection=(stuId,stuName)=>{
        setCheckStudent(prev=>({
            ...prev,
            [stuId]:!prev[stuId]
        }));
        //선택된 학생 이름 업데이트
        setSelectStudent(prev=>(prev===stuName?'':stuName));
    };

    return (
        <div className='evaluationContainer'>
            <div className='eval-leftContainer'>
                <h2 className='evalTitle'>종합 평가</h2>
                <div className='eval-classSelect'>
                    <select>
                        <option>클래스 선택</option>
                    </select> &nbsp;
                    <span style={{fontSize:'20px', color:'#2E5077', fontWeight:'800'}}>(Class)</span>
                </div>

                <div className='eval-classContents'>
                    <table className='evalA-StudentList'>
                        <thead className='evalA-thead'>
                          <tr>
                            <th style={{width:'100px',fontSize:'20px'}}>선택</th>
                            <th style={{fontSize:'20px',width:'200px'}}>학생명</th>
                          </tr>
                        </thead>
                        <tbody>
                            {/**여기에 각 반별 목록을 출력할 예정 아래에 있는건 임시*/}
                            {student.map((stu) => (
                            <tr key={stu.studentId}>
                                <td >
                                    <label className="custom-checkbox-evalAdmin">
                                            <input type="checkbox" style={{display:'none'}}
                                            checked={checkStudent[stu.studentId] || false}
                                            onChange={() => toggleStudentSelection(stu.studentId, stu.name)}/>
                                            <span></span>
                                    </label>
                                </td>
                                <td className='studentName'
                                    onClick={()=>toggleStudentSelection(stu.studentId, stu.name)}
                                    style={{cursor:'pointer'}}> {stu.name}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='eval-rightContainer'>
              <h2 style={{visibility: 'hidden'}}>영역확보</h2>
                <div className='eval-rightTitle'>
                    <span style={{fontSize:'20px', color:'#2E5077', fontWeight:'800'}}
                    className='rightStudentName'>{selectStudent ? `${selectStudent}` : '(학생이름)'}</span>&nbsp;
                    <span>종합평가</span>
                </div>
                
                <div className='evaluationContent'>
                  <div className='evaluationHeader'>
                    <select className='evaluSelect'>
                        <option>과목 선택</option>
                        {Array.isArray(subject) && subject.map((subj, index) => (
                            <option key={index}>{subj}</option>
                        ))}
                    </select>

                    <select className='evaluSelect'>
                        <option>평가 종류 선택</option>
                        <option value={'WEEKLY'}>주간평가</option>
                        <option value={'MONTHLY'}>월 평가</option>
                    </select>

                    <div  className='evalA-StartDate'>
                        <label className='evalA-start'>시작 날짜</label> &nbsp;
                        <input type='date' className='evalA-Date'/>
                    </div>&nbsp;
                    <div className='evalA-endDate'>
                        <label className='evalA-end'>종료 날짜</label> &nbsp;
                        <input type='date' className='evalA-Date'/>
                    </div>
                    <button  type='button' className='saveEval'>저장</button>  
                  </div>

                  <div className='evaluationBody'>
                    <span>점수</span>
                    <input type='number' min="0" max="100"/>
                    <br/>
                    <span>평가 작성</span>
                    <br/>
                    <textarea placeholder='평가 내용을 입력해주세요.'></textarea>
                  </div>
                </div>
            </div>

        </div>
    );
};

export default TotalEvaluationsAdmin;