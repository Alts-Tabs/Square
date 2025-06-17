import React, { useEffect, useRef } from 'react';
import './mobileAttend.css';
import './mobileAttendParent.css';
import ApexCharts from 'apexcharts';
import { attendanceChartOptions } from '../attendBook/attendanceChartOptions';


const MobileAttendParent = () => {
    // 당일 출석 날짜 출력
    const getTodayDate = () => {
        const today = new Date();
        const year = String(today.getFullYear()).slice(2); // '25'
        const month = String(today.getMonth() + 1).padStart(2, '0'); // '05'
        const date = String(today.getDate()).padStart(2, '0'); // '19'
        return `${year}.${month}.${date} 출석`;
    };

    const chartRef = useRef(null);

    // 누적 출석 차트
    useEffect(() => {
        if (chartRef.current) {
        const chart = new ApexCharts(chartRef.current, attendanceChartOptions );
        chart.render();

        // 언마운트 시 chart 파괴
        return () => chart.destroy();
        }
    }, []);
    
    return (
        <div className='m-attend-parent-container'>
            <div className='m-today-title'>
                <span className='m-attendTitle'> 우리 반 누적 출석률 </span>
            </div>

            <div className='m-stackAttend'>
                {/* 원형 그래프 */}
                <div className='m-attendGraph' ref={chartRef}></div>

                {/* 반 누적 % */}
                <div className='m-attendClass'>  
                    <span style={{fontSize:'20px', color:'#2E5077', fontWeight:'700'}}> 우리 반 누적 출석률은 </span> &nbsp;        
                    <span style={{fontSize:'20px', color:'#79D7BE', fontWeight:'800'}}> (수치)% </span> &nbsp;                               
                    <span style={{fontSize:'20px', color:'#2E5077', fontWeight:'700'}}> ! </span>
                    
                    <div className="m-attenderWrapper">
                        <div className='m-attender'>
                            <span className='m-attenderTitle'> 이번 달 출석왕 </span> <br />
                            <span className='m-attenderName'> (학생명) </span>
                        </div>

                        <div className='m-attender'>
                            <span className='m-attenderTitle'> 이번 달 분발왕 </span> <br />
                            <span className='m-attenderName'> (학생명) </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='m-todayAttend'>
                <div className='m-today-title'>
                    <span className='m-attendTitle'> 오늘의 출석 </span>
                </div> 

                {/* 지금 수업은 ~입니다. */}
                <div className='m-todayAttendTitle3'>
                    <span> 지금 수업은 </span>
                    <span style={{fontSize:'20px', color:'#2E5077', fontWeight:'800'}}> 
                        (수업 시간표) 
                    </span>
                    <span> 입니다. </span> <br/>
                </div>

                {/* 해당 자녀의 누적 출석률 */}
                <div className='m-mystackAttend'>
                    여기다 뭐 넣냐 
                </div>
            </div>

        </div>
    );
};

export default MobileAttendParent;