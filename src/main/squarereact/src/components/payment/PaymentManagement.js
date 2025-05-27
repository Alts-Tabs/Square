import React, { useCallback, useEffect, useState } from 'react';
import './paymentManagement.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentManagement = () => {
    const {acaId} = useParams();
    const [classes, setClasses] = useState([]);

    //클래스 목록 함수
    const fetchClassList = useCallback(() => {
        axios.get(`/dir/${acaId}/payment/getclass`, {withCredentials: true})
            .then(res => setClasses(res.data))
            .catch(err => alert("클래스 목록 로딩 실패", err));
    }, [acaId]);

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
                                classes.map(cls=>(
                                    <React.Fragment key={cls.id}>
                                        <tr>
                                            <td rowSpan={2}>
                                                <div className='ellipse'/>
                                            </td>
                                            <td>
                                                &nbsp;&nbsp;&nbsp;
                                                강사명: <b>{cls.teacherName}</b>
                                                &nbsp;&nbsp;&nbsp;
                                                &nbsp;&nbsp;&nbsp;
                                            </td>
                                            <td>
                                                수업료: <b>{cls.tuition}원</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                &nbsp;&nbsp;&nbsp;
                                                {cls.name}
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
                                수업명&nbsp;&nbsp;&nbsp;
                                <input className='insert-input'/>
                            </p>
                            <p className='insert-label'>
                                수업료&nbsp;&nbsp;&nbsp;
                                <input className='insert-input'/>
                            </p>
                            <p className='insert-label'>
                                강사명&nbsp;&nbsp;&nbsp;
                                <input className='insert-input'/>
                            </p>
                            <button className='btn insertButton btn-outline-success'>수정</button>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    );
};

export default PaymentManagement;