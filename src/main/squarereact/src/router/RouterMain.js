import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Root, Main } from '../frame';
import { Attend, AttendHistory } from '../attendBook';
import { JoinPage, LoginPage, SubCode, SubUserRegistry } from '../member';
import PaymentManagement from '../components/PaymentManagement';
import { EvalAdmin, EvalParents, EvalStudent } from '../evaluations';

const RouterMain = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Root />} />

                <Route path="/main" element={<Main />}> {/* Header & Navi 레이아웃 */}
                    <Route path="attend" element={<Attend />} /> {/* attend 경로 */}
                    <Route path="attend/attend-history" element={<AttendHistory />} />
                    <Route path="paymentManagement" element={<PaymentManagement />} /> {/* 원장의 수업 수강료 관리창 */}
                    <Route path="subuserregistry" element={<SubUserRegistry />} /> {/* 서브계정 등록 */}

                    <Route path="evaluationAdmin" element={<EvalAdmin/>}/> {/*학원관계자 종합평가 관리 */}
                    <Route path="evaluationParents" element={<EvalParents/>}/> {/*학부모 종합평가 관리 */}
                    <Route path="evaluationStudent" element={<EvalStudent/>}/> {/*학생 종합평가 관리 */}
                </Route>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/join" element={<JoinPage />} />
                <Route path='/subcode' element={<SubCode />} />
            </Routes>
        </BrowserRouter>
    );
};

export default RouterMain;