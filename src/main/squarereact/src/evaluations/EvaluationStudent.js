import React from 'react';
import './EvaluationStudent.css';

const EvaluationStudent = () => {

    return (
        <div className='evaluationSContainer'>
          <div className='evalS-topContainer'>
            <h2 className='evalTitle'>종합 평가</h2>
            <div className='evalS-selectInfo'>
                <table>
                    <tr>
                        <th >과목</th>
                        <td>
                            <select>
                                <option>
                                    과목을 선택하세요.
                                </option>
                            </select>
                        </td>
                        <th>종류</th>
                        <td>
                            <select>
                                <option>
                                    평가 종류를 선택하세요. 
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>시작</th>
                        <td>
                            <div className="evalS-date">
                                <input type="date" className='evalS-StartDate'/>
                            </div>
                        </td>
                        <th>종료</th>
                        <td>
                            <div className="evalS-date">
                                <input type="date" className='evalS-StartDate'/>
                                <button type='button' className='evalS-Searchbtn'>조회</button>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            <div className='evalS-listContainer'>
                <table className='evalS-listTable'>
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
                        <tr>
                            <td>1.</td>
                            <td>수학(김임시)</td>
                            <td>80</td>
                            <td>임시데이터입니다.</td>
                            <td>2025.05.21</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>  
        </div>
    );
};

export default EvaluationStudent;