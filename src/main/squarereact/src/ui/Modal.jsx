import React from 'react';
import './Modal.css';

const Modal = ({ onClose, children }) => {
  // children - 모달 내용
  // onClose - 모달 보이고 안 보이게 하는 내용
  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <i className="bi bi-x modal-close" onClick={onClose}></i>
        <br />
        {children}
      </div>
    </div>
  );
};

export default Modal;