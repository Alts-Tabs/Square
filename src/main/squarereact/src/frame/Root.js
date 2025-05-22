import React, { useEffect, useRef } from 'react';
import './root.css';
import rootBackground from '../image/rootBackground.png';
import whale_R from '../image/whale_R.png';
import SquareLogo from '../image/SquareLogo.png';
import AltsTabs from '../image/AltsTabs.png';
import { activateBubbleCursor } from '../ui/bubbleCursor';
import { useNavigate } from 'react-router-dom';

const Root = () => {
    const navigate = useNavigate();
    const rootRef = useRef(null);
    const cleanupBubble = useRef(null);

    // 버블 마우스 커서
    useEffect(() => {
        if (rootRef.current) {
            cleanupBubble.current = activateBubbleCursor(rootRef.current);
        }
        return () => {
            if (cleanupBubble.current) cleanupBubble.current();
        };
    }, []);

    return (
        <div
            ref={rootRef} // 이 div에 버블 커서 적용
            className="root-container fade-in"
        >
            <img src={whale_R} alt="whale_R" style={{width:'7%'}}/>  {/* 고래 */}

            {/* Square */}
            <img
                src={SquareLogo}
                alt="SquareLogo"
                style={{ width: '37%', cursor: 'pointer' }}
                onClick={() => navigate('/login')}
            />

            <img src={AltsTabs} alt="AltsTabs" style={{width:'16%', marginTop:'20px', marginBottom:'90px'}}/>  {/* 팀명 */}
        </div>
    );
};

export default Root;