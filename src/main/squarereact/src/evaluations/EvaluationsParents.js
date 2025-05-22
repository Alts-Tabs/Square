import React from 'react';
import './EvaluationsParents.css';
const EvaluationsParents = () => {


    return (
        <div className='evaluationpContainer'>
            <div className='evalp-topContainer'>
                <h2 className='evalTitle'>종합 평가</h2>
                <div className='evalp-selectInfo'>
                    <table>
                        <tr>
                            <th>학생</th>
                            <td colSpan='3'>
                                <select>
                                    <option>
                                        학생를 선택하세요.
                                    </option>
                                </select>
                            </td>
                        </tr>
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
                                
                                    <input type="date" className='evalP-StartDate'/>
                                
                            </td>
                            <th>종료</th>
                            <td>
                                
                                    <input type="date" className='evalP-EndDate'/>
                                    <button type='button' className='evalP-Searchbtn'>조회</button>
                                
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
    );
};

export default EvaluationsParents;