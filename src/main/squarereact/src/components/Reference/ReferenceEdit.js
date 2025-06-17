import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './referenceEdit.css';
import axios from 'axios';

const PostForm = () => {
  const location = useLocation();
  const academyId = location.state?.academyId; // 소속 학원 PK
  const reference = location.state?.reference;

  // console.log(reference);
  const navigate = useNavigate();
  const [title, setTitle] = useState(reference.title);
  const [content, setContent] = useState(reference.content);
  const [idx, setIdx] = useState(reference.categoryIdx);
  const fileInputRef = useRef(null);

  const MAX_TITLE_LENGTH = 50;
  const [existingFiles, setExistingFiles] = useState(reference?.files || []);
  const [newFiles, setNewFiles] = useState([]);
  const [fileAttachOpen, setFileAttachOpen] = useState(true);
  

 // 카테고리 목록
  const [folders, setFolders] = useState([]);
  useEffect(() => {
    axios.get(`/public/${academyId}/category`, { withCredentials: true })
      .then(res => {
        setFolders(res.data);
      })
      .catch(err => {
        alert("자료실 카테고리 로딩에 실패했습니다.");
      });
  }, [academyId]);

  // 삭제할 파일 ID 계산
  const deleteFileIds = reference.files
    .filter(file => !existingFiles.some(f => f.id === file.id)).map(file => file.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 등록 처리
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("categoryIdx", idx);

      // 삭제할 파일 ID
      deleteFileIds.forEach((id) => {
        formData.append("deleteFileIds", id);
      });

      // 새 파일 추가
      newFiles.forEach((file) => {
        formData.append("files", file);
      });

      await axios.put(`/th/${reference.id}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      alert("자료실 글이 수정되었습니다.");
      navigate(-1);
    } catch {
      alert("자료실 수정에 실패했습니다.");
    }
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_TITLE_LENGTH) setTitle(val);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setNewFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemoveExistingFile = (index) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));

  };

  const handleRemoveNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
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
              <label>폴더 선택</label>
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
                <select value={idx} onChange={(e) => setIdx(e.target.value)} className='toolbar-font'>
                  <option value={0}>선택 안함</option>
                  {folders && folders.map(f => (
                    <option key={f.idx} value={f.idx}>{f.category}</option>
                  ))}
                </select>
              </div>
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
                  {(existingFiles.length > 0 || newFiles.length > 0) ? (
                    <ul className="file-list">
                      {existingFiles.map((file, index) => (
                        <li key={`existing-${index}`} className="file-item">
                          <span className="file-name">{file.originalFilename}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveExistingFile(index);
                            }}
                            className="btn-remove-file"
                          >×</button>
                        </li>
                      ))}
                      {newFiles.map((file, index) => (
                        <li key={`new-${index}`} className="file-item">
                          <span className="file-name">{file.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveNewFile(index);
                            }}
                            className="btn-remove-file"
                          >×</button>
                        </li>
                      ))}
                    </ul>
                  ) : ('파일을 끌어다 놓거나 클릭하여 선택하세요')}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="editor-toolbar"></div>
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
