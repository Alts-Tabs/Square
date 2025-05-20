import React, { useState } from 'react';
import './EvaluationsParents.css';
import DatePicker from 'react-datepicker';
const EvaluationsParents = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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
                                <div className="evalp-datepicker-wrapper">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    isClearable
                                    placeholderText="시작일 선택"
                                    dateFormat="yyyy-MM-dd"
                                    className="custom-datepicker-evalParents"
                                />
                                </div>
                            </td>
                            <th>종료</th>
                            <td>
                                <div className="evalp-datepicker-wrapper">
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    isClearable
                                    placeholderText="종료일 선택"
                                    dateFormat="yyyy-MM-dd"
                                    className="custom-datepicker-evalParents"
                                />
                                <button type='button' className='evalP-Searchbtn'>조회</button>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

            </div>
            <div className='evalp-listContainer'>
                <table className='table table-bordered evalp-listTable'>
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