import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from '../components/Main';
import Attend from '../components/Attend';
import AttendHistory from '../components/AttendHistory';

const RouterMain = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />}> {/* Header & Navi 레이아웃 */}
                        <Route path="/attend" element={<Attend />} /> {/* attend 경로 */}
                        <Route path="/attend-history" element={<AttendHistory />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default RouterMain;