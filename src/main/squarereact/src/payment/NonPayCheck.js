import React, { useEffect, useState } from 'react';
import './NonPayCheck.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NonPayCheck = () => {
    const { acaId } = useParams();

    const [allEnroll, setAllEnroll] = useState([]); //학원의 장바구니 조회
    const [classes, setClasses] = useState([]);
    const [selClass, setSelClass] = useState([]);

    const filteredEnroll = selClass
        ? allEnroll.filter(ae => ae.className === selClass)
        : allEnroll; 

    useEffect(()=>{
        fetchAllEnroll();
        // eslint-disable-next-line
    }, [acaId]);

    //모든 신청 내역을 확인
    const fetchAllEnroll = () => {
        if(!acaId) return;
        axios.get(`/dir/${acaId}/enrollList`, {withCredentials: true})
        .then(res => {setAllEnroll(res.data)})
        .catch(err => {alert('수강 신청 데이터 조회 실패!')})
    };

    // select에서 클래스 목록 불러오기
    const fetchClassSelect = () => {
        if(!acaId) return;

        axios.get(`/parent/${acaId}/classes`, {withCredentials: true})
        .then(res => {setClasses(res.data)})
        .catch(err => {alert('클래스 호출 실패')});
    }

    // acaId(학원) 바뀔 때 1번만 부르기
    useEffect(() => {
        fetchClassSelect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acaId]);

    return (
        <div>
            <div className='nonPayCheckContainer'>
                <div className='nonPay-topContainer'>
                    <h2 className='nonPayTitle'>미납 관리</h2>
                    <div className='nonPay-selectInfo'>
                        <table>
                            <tr>
                                <td>
                                    <select
                                        value={selClass}
                                        onChange={(e)=>setSelClass(e.target.value)}>
                                        <option value=''>반을 선택하세요.</option>
                                        {classes.map(cls => (
                                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div className='nonPay-listContainer'>
                <table border={0} className='classMenu'>
                    <tbody>
                    {
                        filteredEnroll.map(ae=>(
                            <React.Fragment key={ae.id}>
                                <tr>
                                    <td rowspan="2">
                                        <div className='ellipse'/>
                                    </td>
                                    <td>학생명 {ae.studentName}</td>
                                    <td>학부모명 {ae.parentName}</td>
                                    <td>{ae.isPay === "T" ? "납부" : "미납"}</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;&nbsp;&nbsp;[{ae.className}]</td>
                                    <td>
                                        수업료 {ae.tuition
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                                    </td>
                                    <td>{ae.duration}</td>
                                </tr>
                            </React.Fragment>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NonPayCheck;