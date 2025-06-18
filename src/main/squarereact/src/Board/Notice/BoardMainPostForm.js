import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import './BoardMainPostForm.css';

const BoardMainPostForm = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [category, setCategory] = useState(queryParams.get('category') || '공지사항');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [fileAttachOpen, setFileAttachOpen] = useState(true);
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const MAX_TITLE_LENGTH = 50;

  const { role } = useOutletContext(); // 사용자 역할 받아오기
  const [userRole, setUserRole] = useState('');

  // role 값을 내부 권한으로 변환
  useEffect(() => {
    if (role === '학생') setUserRole('ROLE_STUDENT');
    else if (role === '학부모') setUserRole('ROLE_PARENT');
    else if (role === '원장') setUserRole('ROLE_DIRECTOR');
    else setUserRole('ROLE_OTHER');
  }, [role]);

  // STUDENT나 PARENT면 카테고리 고정
  useEffect(() => {
    if (['ROLE_STUDENT', 'ROLE_PARENT'].includes(userRole)) {
      setCategory('자유게시판');
    }
  }, [userRole]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_TITLE_LENGTH) setTitle(val);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const applyStyle = (command, value = null) => {
    document.execCommand('styleWithCSS', false, true);
    if (command === 'fontName') {
      const selection = window.getSelection();
      if (selection.rangeCount) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontFamily = value.replace(/,\s*[^,]+/, '');
        range.surroundContents(span);
      }
    } else {
      document.execCommand(command, false, value);
    }
    editorRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const dto = {
      title,
      content: editorRef.current.innerHTML,
      category,
    };
    formData.append('board', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post('/public/api/board', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
      navigate('/main/board');
    } catch (error) {      
      alert('게시글 작성에 실패했습니다.');
    }
  };

  return (
  <div className="board-wrapp">
    <div className="board-header">
      <span className="board-title">학원 게시판</span>
    </div>
    <div className="boardMenu">
      <form className="board-form" onSubmit={handleSubmit}>
        <div className="rowtops">
          <div className="row row-top1">
            {userRole ? (
              ['ROLE_STUDENT', 'ROLE_PARENT'].includes(userRole) ? (
                <select className="select category selectMenu1" value="자유게시판" disabled>
                  <option value="자유게시판">자유게시판</option>
                </select>
              ) : (
                <select
                  className="select category selectMenu1"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="공지사항">공지사항</option>
                  <option value="자유게시판">자유게시판</option>
                  <option value="FAQ">FAQ</option>
                </select>
              )
            ) : (
              <p>로딩 중...</p>
            )}
          </div>
        </div>
        <div className="boardTitle">
          <br />
        </div>
        <div className="reference-row">
          <div className="boardTitle1">
            <label htmlFor="title">제목</label>
            <div className="file-attach-toggle">
              <span>파일첨부</span>
              <button
                type="button"
                className="btn-toggle"
                onClick={() => setFileAttachOpen((prev) => !prev)}
                aria-label={fileAttachOpen ? '파일첨부 접기' : '파일첨부 펼치기'}
              >
                {fileAttachOpen ? '−' : '+'}
              </button>
            </div>
          </div>
          <div className="reference-fields">
            <div>
              <input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="input-title"
                required
              />
              <div className="title-counter">
                {title.length} / {MAX_TITLE_LENGTH}
              </div>
            </div>
            {fileAttachOpen && (
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="btn-upload"
                >
                  내 PC
                </button>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div
                  className="file-drop-area"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current.click()}
                >
                  {files.length > 0 ? (
                    <ul className="file-list">
                      {files.map((file, index) => (
                        <li key={index} className="file-item">
                          <span className="file-name">{file.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(index);
                            }}
                            className="btn-remove-file"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    '파일을 끌어다 놓거나 클릭하여 선택하세요'
                  )}
                </div>
              </div>
            )}
          </div> {/* reference-fields 닫기 */}
        </div> {/* reference-row 닫기 */}
        {/* 툴바 */}
        <div className="editor-toolbar">
          <select className="toolbar-font" onChange={(e) => applyStyle('fontName', e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="'Edu NSW ACT Hand Pre', cursive">Edu NSW ACT Hand Pre</option>
            <option value="Lato, sans-serif">Lato</option>
            <option value="Ubuntu, sans-serif">Ubuntu</option>
            <option value="Caprasimo, cursive">Caprasimo</option>
          </select>
          <select className="toolbar-fontsize" onChange={(e) => applyStyle('fontSize', e.target.value)}>
            {[...Array(15)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{10 + i}px</option>
            ))}
          </select>
          <input type="color" className="toolbar-color" onChange={(e) => applyStyle('foreColor', e.target.value)} />
          <button type="button" className="toolbar-btn bold" onClick={() => applyStyle('bold')}><b>B</b></button>
          <button type="button" className="toolbar-btn underline" onClick={() => applyStyle('underline')}><u>U</u></button>
          <button type="button" className="toolbar-btn align-left" onClick={() => applyStyle('justifyLeft')}>
            <i className="bi bi-text-left"></i>
          </button>
          <button type="button" className="toolbar-btn align-center" onClick={() => applyStyle('justifyCenter')}>
            <i className="bi bi-text-center"></i>
          </button>
          <button type="button" className="toolbar-btn align-right" onClick={() => applyStyle('justifyRight')}>
            <i className="bi bi-text-right"></i>
          </button>
        </div>

        <div
          ref={editorRef}
          className="input content editor-content"
          contentEditable="true"
          onInput={() => {}}
        />
        <div className="form-buttons">
          <button type="button" className="btn cancel" onClick={() => navigate('/main/board')}>
            취소
          </button>
          <button type="submit" className="btn submit">
            등록
          </button>
        </div>
      </form>
    </div> 
  </div> 
);
};

export default BoardMainPostForm;