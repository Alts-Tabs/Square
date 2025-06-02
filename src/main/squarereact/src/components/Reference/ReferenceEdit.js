import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './referenceEdit.css';

const PostForm = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState('공지사항');
  const [division, setDivision] = useState('구분');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isMemberOnly, setIsMemberOnly] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [isSecret, setIsSecret] = useState(false);

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const MAX_TITLE_LENGTH = 50;
  const [files, setFiles] = useState([]);
  const [fileAttachOpen, setFileAttachOpen] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 등록 처리
  };

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

  const handleCancel = () => {
    navigate(-1);  // 이전 페이지로 이동
  };

  return (
    <div className="board-wrap">
      <div className="board-header">
        <span className="board-title">글수정</span>
      </div>
      <div className="boardMenu">
        <form className="board-form" onSubmit={handleSubmit}>
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
                  <button type="button" onClick={() => fileInputRef.current.click()} className="btn-upload">
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
            </div>
          </div>

          <div className="editor-toolbar">
            <select className="toolbar-font">
              <option>기본 서체</option>
              <option>고딕</option>
              <option>맑은전청조체</option>
            </select>
            <select className="toolbar-fontsize">
              <option>15</option>
              <option>14</option>
              <option>16</option>
            </select>
            <button type="button" className="toolbar-btn bold">
              <b>B</b>
            </button>
            <button type="button" className="toolbar-btn underline">
              <u>U</u>
            </button>
            <button type="button" className="toolbar-btn align-left">
              <i className="bi bi-text-left"></i>
            </button>
            <button type="button" className="toolbar-btn align-center">
              <i className="bi bi-text-center"></i>
            </button>
            <button type="button" className="toolbar-btn align-right">
              <i className="bi bi-text-right"></i>
            </button>
          </div>

          <textarea
            className="input content"
            placeholder="내용을 입력해 주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              수정
            </button>
            <button type="button" onClick={handleCancel} className="btn-cancel">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
