import React, { useEffect, useState } from 'react';
import './EvaluationStudent.css';
import axios from 'axios';

const EvaluationStudent = () => {
    const [selectSubject, setSelectSubject]=useState('');
    const [selectPeriod, setSelectPeriod]=useState('');
    //로그인한 계정 정보
    const [subject,setSubject]=useState([]);
    const [userId, setUserId]= useState(null);
    const [evaluations, setEvaluations] = useState([]);

    //조회 버튼 이벤트
    const handleSearchStudenEval=()=>{
        if (!userId) {
            alert("사용자 정보가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        axios.get(`/student/evalStuSearch`,{
            params: {
                userId:userId,
                subject : selectSubject || null,
                period : selectPeriod || null,
                startDate : document.querySelector('.evalS-StartDate').value || null,
                endDate: document.querySelector('.evalS-EndDate').value || null,
            },
            withCredentials : true
        })
        .then(response => {
            setEvaluations(response.data);
        })
        .catch(error=>console.error(error));
    };

    //진입 시 전체 평가 리스트 가져오기
    useEffect(() => {
        // 로그인한 userId 받아오기
        axios.get(`/public/user`, { withCredentials: true })
            .then(response => {
                //console.log("로그인 사용자 정보:", response.data);
                const { userId } = response.data; //서버에서 userId를 추출 API 응답데이터에서 userId를 꺼내서 상태(setUserId)에 넣어주는 작업
                 return Promise.all([
                    axios.get(`/student/evalStuSubject`, { params: { userId }, withCredentials: true }),
                    axios.get(`/student/evalStuList`, { params: { userId }, withCredentials: true })
                 ]).then(([subjectRes,evalRes]) => {
                setSubject(subjectRes.data);
                setEvaluations(evalRes.data);
                 setUserId(userId);
                });
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <div className='evaluationSContainer'>
          <div className='evalS-topContainer'>
            <h2 className='evalTitle'>종합 평가</h2>
            <div className='evalS-selectInfo'>
                <table>
                    <tr>
                        <th >과목</th>
                        <td>
                            <select value={selectSubject} onChange={(e)=>setSelectSubject(e.target.value)}>
                                <option value="">과목 선택</option>
                                {subject.map((subj, index)=>(
                                    <option key={index} value={subj.subject}>
                                        {`${subj.subject}(${subj.teacherName})`}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <th>종류</th>
                        <td>
                            <select value={selectPeriod} onChange={(e)=>setSelectPeriod(e.target.value)}>
                                <option value="">평가 종류 선택</option>
                                <option value={'WEEKLY'}>주간평가</option>
                                <option value={'MONTHLY'}>월 평가</option>
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
                                <input type="date" className='evalS-EndDate'/>
                                <button type='button' className='evalS-Searchbtn' onClick={handleSearchStudenEval}>조회</button>
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
                        {evaluations.length>0?(
                            evaluations.map((evalItem,index)=>(
                                <tr key={index}>
                                    <td>{index+1}.</td>
                                    <td>{`${evalItem.subject}(${evalItem.teacherName})`}</td>
                                    <td>{evalItem.score}</td>
                                    <td>{evalItem.contents}</td>
                                    <td>{evalItem.created_at}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5"> 조회된 데이터가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>  
        </div>
    );
};

export default EvaluationStudent;