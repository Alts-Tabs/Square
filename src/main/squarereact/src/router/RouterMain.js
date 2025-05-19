import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from '../components/Main';
import Attend from '../components/Attend';
import { JoinPage, LoginPage } from '../member';
import PaymentManagement from '../components/PaymentManagement';

const RouterMain = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />}> {/* Header & Navi 레이아웃 */}
                        <Route path="attend" element={<Attend />} /> {/* attend 경로 */}
                        <Route path="paymentManagement" element={<PaymentManagement />} /> {/* 원장의 수업 수강료 관리창 */}
                    </Route>

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/join" element={<JoinPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default RouterMain;