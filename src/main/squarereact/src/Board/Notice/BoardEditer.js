import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import './BoardEditer.css';

const BoardEditer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useOutletContext();
  const queryParams = new URLSearchParams(location.search);
  const editPostId = queryParams.get('edit');
  const categoryParam = queryParams.get('category') || '공지사항';
  const [isEditMode, setIsEditMode] = useState(!!editPostId);

  useEffect(() => {
    setIsEditMode(!!editPostId); // editPostId 변경 시 isEditMode 업데이트
  }, [editPostId]);

  const [category, setCategory] = useState(categoryParam);
  const [division, setDivision] = useState('전체');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isMemberOnly, setIsMemberOnly] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [isSecret, setIsSecret] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileAttachOpen, setFileAttachOpen] = useState(true);
  const fileInputRef = useRef(null);

  const MAX_TITLE_LENGTH = 50;
  const MAX_FILES = 5;

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`/public/api/board/${editPostId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const post = response.data;
          setCategory(post.category);
          setDivision(post.division);
          setTitle(post.title);
          setContent(post.content);
          setIsMemberOnly(post.isMemberOnly);
          setAllowComments(post.isAllowComments);
          setIsSecret(post.isSecret);
        } catch (error) {          
          alert('게시글을 불러오지 못했습니다.');
        }
      };
      fetchPost();
    }
  }, [editPostId, isEditMode]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    if (val.length > MAX_TITLE_LENGTH) {
      alert(`제목은 최대 ${MAX_TITLE_LENGTH}자까지만 입력 가능합니다.`);
      return; // 초과 시 입력 무시
    }
    setTitle(val);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > MAX_FILES) {
      alert(`최대 ${MAX_FILES}개 파일까지만 첨부 가능합니다. 현재 ${files.length}개, 추가 ${selectedFiles.length}개로 초과됩니다.`);
      return; // 초과 시 업로드 무시
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const totalFiles = files.length + droppedFiles.length;
    if (totalFiles > MAX_FILES) {
      alert(`최대 ${MAX_FILES}개 파일까지만 첨부 가능합니다. 현재 ${files.length}개, 추가 ${droppedFiles.length}개로 초과됩니다.`);
      return; // 초과 시 드롭 무시
    }
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const dto = {
      title,
      content,
      category,
      division,
      isMemberOnly,
      allowComments,
      isSecret,
    };
    formData.append('board', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    files.forEach((file) => formData.append('files', file));

    try {
      const token = localStorage.getItem('token');
      if (isEditMode) {
        await axios.put(`/public/api/board/${editPostId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        alert('게시글 수정 성공');
      } else {
        await axios.post('/public/api/board', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        alert('게시글 작성 성공');
      }
      navigate('/main/board');
    } catch (error) {      
      alert(`게시글 ${isEditMode ? '수정' : '작성'}에 실패했습니다: ${error.response?.data?.message || '서버 오류입니다.'}`);
    }
  };

  if (!userInfo || (userInfo.role !== '원장' && userInfo.role !== '관리자')) {
    return <div className="board-wrap">게시글 수정 권한이 없습니다.</div>;
  }

  return (
    <div className="board-wrap">
      <div className="board-header">
        <span className="board-title">학원 게시판</span>
      </div>
      <div className="boardMenu">
        <form className="board-form" onSubmit={handleSubmit}>
          <div className="rowtops">
            <div className="row row-top1">
              <select className="select category selectMenu1" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="공지사항">공지사항</option>
                <option value="자유게시판">자유게시판</option>
                <option value="FAQ">FAQ</option>
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
            placeholder="내용을 입력해 주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />          
          <div className="form-buttons">
            <button type="button" className="btn cancel" onClick={() => navigate(-1)}>
              취소
            </button>
            <button type="submit" className="btn submit">
              {isEditMode ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardEditer;