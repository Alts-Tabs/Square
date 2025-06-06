import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QnABoardMainPostForm.css';

const PostForm = ({ username }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category: initialCategory = '상담신청' } = location.state || {};

  const [category, setCategory] = useState(initialCategory);
  const [division, setDivision] = useState('구분');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isMemberOnly, setIsMemberOnly] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [isSecret, setIsSecret] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileAttachOpen, setFileAttachOpen] = useState(true);
  const fileInputRef = useRef(null);
  const MAX_TITLE_LENGTH = 50;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(), // 실제로는 백엔드에서 고유 ID 생성
      title,
      author: username || '사용자',
      date: new Date().toISOString().split('T')[0],
      views: 0,
      category: category === '상담신청' ? 'consulting' : category === 'QnA게시판' ? 'qna' : 'faq',
      content,
      isMemberOnly,
      allowComments,
      isSecret,
      files,
    };

    // 새 게시글을 목록 페이지로 전달
    navigate('/qnaboard', { state: { newPost } });
  };

  return (
    <div className="board-wrap">
      <div className="board-header">
        <span className="board-title">상담신청 및 QnA 게시판</span>
      </div>
      <div className="boardMenu">
        <form className="board-form" onSubmit={handleSubmit}>
          <div className="rowtops">
            <div className="row row-top1">
              <select
                className="select category selectMenu1"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="상담신청">상담신청</option>
                <option value="QnA게시판">QnA게시판</option>
                <option value="FAQ게시판">FAQ게시판</option>
              </select>
            </div>
            <div className="row row-top2">
              <select
                className="select division selectMenu2"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
              >
                <option value="구분">구분</option>
                <option value="일반">일반</option>
                <option value="중요">중요</option>
              </select>
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
                <div className="title-counter">{title.length} / {MAX_TITLE_LENGTH}</div>
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
            placeholder="내용을 입력해 주세요.(기본값)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="post-settings">
            <label className="setting">
              <input
                type="checkbox"
                checked={isMemberOnly}
                onChange={(e) => setIsMemberOnly(e.target.checked)}
              />
              멤버 공개
            </label>
            <label className="setting">
              <input
                type="checkbox"
                checked={allowComments}
                onChange={(e) => setAllowComments(e.target.checked)}
              />
              댓글 허용
            </label>
            <label className="setting">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
              />
              비밀 게시글
            </label>
          </div>
          <div className="form-buttons">
            <button type="button" className="btn cancel" onClick={() => navigate('../qnaboard')}>
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

export default PostForm;