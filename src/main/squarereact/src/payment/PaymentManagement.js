import React, { useCallback, useEffect, useState } from 'react';
import './paymentManagement.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentManagement = () => {
    const {acaId} = useParams();
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [tuition, setTuition] = useState('');

    //클래스 목록 함수
    const fetchClassList = useCallback(() => {
        axios.get(`/dir/${acaId}/payment/getclass`, {withCredentials: true})
            .then(res => setClasses(res.data))
            .catch(err => alert("클래스 목록 로딩 실패", err));
    }, [acaId]);

    const handleEllipseClick = (cls) => {
        setSelectedClass(cls);
        setTuition(cls.tuition);
    };

    const handleTuitionChange = (e) => {
        setTuition(e.target.value);
    };

    const handleUpdateTuition = async () => {
    if (!selectedClass) return;
    try {
        await axios.post(
            `/dir/${selectedClass.id}/payment/UpdateTuition`,
            { tuition }, // 보낼 데이터
            { withCredentials: true } //CORS 문제 해결
        );
        alert('수업료가 성공적으로 수정되었습니다!');
        fetchClassList(); // 목록 새로고침
    }
    catch (err) {
        alert('수업료 수정 실패');
    }
    };

    useEffect(() => {
        if(!acaId) return;
        fetchClassList();
    }, [acaId, fetchClassList]);

    return (
        <div>
           <div className='paymentManagementContainer'>    
                <div className='leftContainer'>
                    <span className='title'> 결제 관리 </span>
                    <div className='classRead'>
                        <span> 전체 반 </span>
                        <hr />
                        {classes.length === 0 ? (
                            <div>클래스가 없습니다.</div>
                        ) : (
                        <table border={0} className='classMenu'>
                            <tbody>
                            {
                                classes.map((cls, index) => (
                                    <React.Fragment key={cls.id}>
                                        <tr>
                                            <td rowSpan={2}>
                                                {index + 1}
                                            </td>
                                            <td>
                                                &nbsp;&nbsp;&nbsp;
                                                강사명: <b>{cls.teacherName}</b>
                                                &nbsp;&nbsp;&nbsp;
                                                &nbsp;&nbsp;&nbsp;
                                            </td>
                                            {/* 가독성을 위해 수업료 금액의 세자리마다 콤마로 구분*/}
                                            <td>
                                                <div onClick={()=>handleEllipseClick(cls)}>
                                                    수업료: <b>{cls.tuition
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</b>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                과목명: {cls.name}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            }
                            </tbody>   
                        </table>
                        )}
                    </div>
                </div>

                <div className='rightContainer'>
                    {/* 수업료 변경 */}
                    <span className='title'> 수업료 변경 </span>
                    <div className='tuitionUpdate'>
                        <div className='insertClass'>
                            <p className='insert-label'>
                                수업료&nbsp;&nbsp;&nbsp;
                                <input
                                    type='number'
                                    className='insert-input'
                                    value={tuition}
                                    onChange={handleTuitionChange}
                                />
                                원
                            </p>
                            <p>변경할 수업의 수업료 부분을 클릭하세요</p>
                            <button
                                className='btn insertButton btn-success'
                                onClick={handleUpdateTuition}
                                disabled={!selectedClass}
                            >
                                수정
                            </button>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    );
};

export default PaymentManagement;