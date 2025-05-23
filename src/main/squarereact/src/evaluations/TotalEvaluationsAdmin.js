import React, { useState } from 'react';
import './TotalEvaluationsAdmin.css';

const TotalEvaluationsAdmin = () => {
    const [selectStudent, setSelectStudent]=useState('');
    const handleSelectStudent=(name)=> setSelectStudent(name);
    
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
                            <th style={{width:'100px',fontSize:'20px'}}>선택</th>
                            <th style={{fontSize:'20px',width:'200px'}}>학생명</th>
                        </thead>
                        <tbody >
                            {/**여기에 각 반별 목록을 출력할 예정 아래에 있는건 임시*/}
                            <tr>
                                <td >
                                    <label className="custom-checkbox-evalAdmin">
                                            <input type="checkbox" style={{display:'none'}}/>
                                            <span></span>
                                    </label>
                                </td>
                                <td className='studentName'
                                    onClick={()=>handleSelectStudent('aaaa')}
                                    style={{cursor:'pointer'}}>aaaa</td>
                            </tr>
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
                    </select>

                    <select className='evaluSelect'>
                        <option>평가 종류 선택</option>
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