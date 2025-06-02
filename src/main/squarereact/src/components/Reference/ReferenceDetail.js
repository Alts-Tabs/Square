// ReferenceDetail.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './referenceDetail.css';

function ReferenceDetail() {
  const navigate = useNavigate();
  const { fileId } = useParams();

  const currentUser = '용가뤼 원장'; // 로그인된 사용자명 (하드코딩)

  const handleBackClick = () => {
    navigate('/main/reference');
  };

  const handleEditClick = () => {
    navigate(`/main/reference/${fileId}/edit`);
  };

  const handleDeleteClick = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      navigate('/main/reference');
    }
  };

  const getKoreanTimeString = () => {
    const now = new Date();
    return now
      .toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(/\./g, '')
      .replace(/\s/g, ' ')
      .trim();
  };

  const [likeCount, setLikeCount] = useState(1);
  const [liked, setLiked] = useState(false);

  // 댓글 리스트
  const [comments, setComments] = useState([
    {
      id: 1,
      author: '용가뤼 원장',
      text: '감사합니다~!',
      date: '2025.05.01 13:00',
      isEditing: false,
      editText: '',
    },
  ]);

  const [newComment, setNewComment] = useState('');

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleSubmit = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    const newEntry = {
      id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
      author: currentUser,
      text: trimmed,
      date: getKoreanTimeString(),
      isEditing: false,
      editText: '',
    };

    setComments([...comments, newEntry]);
    setNewComment('');
  };

  // 좋아요 클릭
  const handleLikeClick = () => {
    if (liked) return;
    setLikeCount(likeCount + 1);
    setLiked(true);
  };

  // 댓글 수정 버튼 클릭
  const handleEditToggle = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, isEditing: !c.isEditing, editText: c.text }
          : { ...c, isEditing: false }
      )
    );
  };

  // 수정 중 텍스트 변경
  const handleEditChange = (id, value) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, editText: value } : c))
    );
  };

  // 수정 저장
  const handleEditSave = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              text: c.editText.trim() || c.text,
              isEditing: false,
              date: getKoreanTimeString(),
            }
          : c
      )
    );
  };

  // 수정 취소
  const handleEditCancel = (id) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEditing: false, editText: '' } : c))
    );
  };

  // 댓글 삭제
  const handleDeleteComment = (id) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="reference-detail-wrapper">
      <div className="reference-detail-container">
        <div className="header-box">
          <div className="header-inner">
            <button className="back-button" onClick={handleBackClick}>
              〈 목록
            </button>
          </div>
          <h2 className="post-title">3월 모의고사 영어 모음</h2>
        </div>

        <div className="author-info-box">
          <div className="author-row">
            <span className="author">용가뤼 원장</span>
            <div className="actions">
              <button className="edit-button" onClick={handleEditClick}>
                수정
              </button>
              <button className="delete-button" onClick={handleDeleteClick}>
                삭제
              </button>
            </div>
          </div>
          <div className="date-views-row">
            <span className="date">2025.05.01</span>
            <span className="views">조회 0</span>
          </div>
        </div>

        <div className="content-box">
          <div className="attachment">
            <a href="/files/3월_고3_모의고사_영어.pdf" download className="attachment-link">
              📎 3월 고3 모의고사 영어.pdf
            </a>
          </div>

          <div className="post-content">
            안녕하세요! 2025년 3월에 시행된 고3 모의고사 영어 문제지 및 해설 파일입니다.
            <br />
            학생들과 함께 복습용으로 활용해주세요!
          </div>

          <hr className="separator" />

          <div className="like-comment-info">
            <button className={`like-button${liked ? ' liked' : ''}`} onClick={handleLikeClick}>
              <i class="bi bi-suit-heart-fill"></i> 좋아요 {likeCount}
            </button>
            <span className="comment-count">댓글 {comments.length}</span>
          </div>

          <div className="comment-list">
            {comments.map((c) => (
              <div key={c.id} className="comment">
                <div className="comment-author">{c.author}</div>
                {!c.isEditing ? (
                  <>
                    <div className="comment-text">{c.text}</div>
                    <div className="comment-date">{c.date}</div>
                    {c.author === currentUser && (
                      <div className="comment-actions">
                        <button
                          className="comment-edit-btn"
                          onClick={() => handleEditToggle(c.id)}
                        >
                          수정
                        </button>
                        <button
                          className="comment-delete-btn"
                          onClick={() => handleDeleteComment(c.id)}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="comment-edit-area">
                    <input
                      type="text"
                      value={c.editText}
                      onChange={(e) => handleEditChange(c.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(c.id);
                        if (e.key === 'Escape') handleEditCancel(c.id);
                      }}
                      autoFocus
                    />
                    <button onClick={() => handleEditSave(c.id)}>저장</button>
                    <button onClick={() => handleEditCancel(c.id)}>취소</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="comment-write">
            <div className="comment-author-label">{currentUser}</div>
            <div className="comment-input-area">
              <input
                type="text"
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button className="submit-button" onClick={handleSubmit}>
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferenceDetail;
