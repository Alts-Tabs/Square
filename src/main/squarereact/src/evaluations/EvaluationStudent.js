import React, { useEffect, useState } from 'react';
import './EvaluationStudent.css';
import '../Board/Notice/BoardMainPage.css'; //페이징 css 가져오기
import axios from 'axios';

const EvaluationStudent = () => {
    const [selectSubject, setSelectSubject]=useState('');
    const [selectPeriod, setSelectPeriod]=useState('');
    //로그인한 계정 정보
    const [subject,setSubject]=useState([]);
    const [userId, setUserId]= useState(null);
    const [role, setRole]= useState('');
    const [evaluations, setEvaluations] = useState([]);

    //조회 버튼 이벤트
    const handleSearchStudenEval=()=>{
        if (!userId) {
            alert("사용자 정보가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        if (role !== "학생") {
            alert("학생 계정으로만 조회 가능합니다.");
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

    useEffect(() => {
        // 로그인한 userId와 role 받아오기
        axios.get(`/public/user`, { withCredentials: true })
            .then(response => {
                const { userId, role } = response.data;
                setUserId(userId);
                setRole(role);

                if (role === "학생") {
                    return Promise.all([
                        axios.get(`/student/evalStuSubject`, { params: { userId }, withCredentials: true }),
                        axios.get(`/student/evalStuList`, { params: { userId }, withCredentials: true })
                    ]).then(([subjectRes, evalRes]) => {
                        setSubject(subjectRes.data);
                        setEvaluations(evalRes.data);
                    });
                } else {
                    // role이 학생이 아닌 경우 데이터 초기화
                    setSubject([]);
                    setEvaluations([]);
                }
            })
            .catch(error => console.error(error));
    }, []);

    // 페이징 번호
    const[currentPage,setCurrentPage]=useState(1);
    const itemsPerPage = 10;
    const totalPages=Math.ceil(evaluations.length/itemsPerPage);
    const currentItems=evaluations.slice((currentPage-1)*itemsPerPage,currentPage* itemsPerPage);
    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);
    const pageNumbers=Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i); //페이지 번호 동적 생성

    //페이지 클릭 핸들러
    const handlePageClick=(pageNumber)=>{
        setCurrentPage(pageNumber);
    }

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
                    <tbody >
                        {currentItems.length>0?(
                            currentItems.map((evalItem,index)=>(
                                <tr key={index}>
                                    <td>{(currentPage-1) * itemsPerPage +index+1}</td>
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

            {/* 페이징 + 검색 */}
            <div className="evalS-pagination-container evalSPage">
                <div className="evalS-Pagination">
                     <span onClick={() => {const newPage = Math.max(1, Math.floor((currentPage - 1) / 10) * 10);
                        setCurrentPage(newPage);
                    }}>&lt;</span>
                    {pageNumbers.map((num) => (
                        <span key={num} onClick={()=>handlePageClick(num)}
                        className={num === currentPage ? 'active' : ''}>
                        {num}
                        </span>
                    ))}
                    <span onClick={() => {const newPage = Math.min(totalPages, (Math.floor((currentPage - 1) / 10) + 1) * 10 + 1);
                        setCurrentPage(newPage);
                    }}>&gt;</span>
                </div>
            </div>

          </div>  
        </div>
    );
};

export default EvaluationStudent;