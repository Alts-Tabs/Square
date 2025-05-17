import React from 'react';
import './paymentManagement.css';

const PaymentManagement = () => {
    return (
        <div>
           <div className='paymentManagementContainer'>
                
                <div className='leftContainer'>
                    {/* 오늘의 출석 */}
                    <span className='title'> 결제 관리 </span>
                    <div className='classRead'>
                        <span> 전체 반 </span>
                    </div>
                </div>


                <div className='rightContainer'>
                    {/* 수업료 변경 */}
                    <div className='tuitionUpdate'>
                        <span className='title'> 수업료 변경 </span>
                    </div>
                    {/* 수업 신규 등록 */}
                    <div className='insertClass'>
                        <span className='title'> 수업 등록 </span>
                    </div>
                </div>    
            </div>
        </div>
    );
};

export default PaymentManagement;