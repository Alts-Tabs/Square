import React from 'react';
import './error404.css';
import errorBackground from '../image/errorBackground.png';
import errorText from '../image/errorText.png';
import { Link } from 'react-router-dom';

const Error404 = () => {
    return (
        <div className="errorContainer" style={{ backgroundImage: `url(${errorBackground})` }}>
            <div className="errorContent">
                {/* 404 Not Found 이미지 */}
                <img src={errorText} alt="errorText" className="errorText" />
                <span className='backSpan'>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Back to main
                    </Link>
                </span>
            </div>
            
            <img
                src="https://i.gifer.com/ZdPK.gif"
                alt="bubbles"
                className="bottomImage"
            />
        </div>
    );
};


export default Error404;