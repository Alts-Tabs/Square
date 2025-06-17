import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './referenceDetail.css';

function ReferenceDetail() {
  const location = useLocation();
  const academyId = location.state?.academyId; // 소속 학원 PK
  const role = location.state?.role;
  const name = location.state?.name;
  

  const navigate = useNavigate();
  const { fileId } = useParams();

  const currentUser = '용가뤼 원장'; // 로그인된 사용자명 (하드코딩)

  // 게시글 상태
  const [reference, setReference] = useState(null);
  // 좋아요 상태
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // 게시글, 댓글, 좋아요 정보 API 호출
    axios.get(`/public/${fileId}/reference`)
      .then(res => {
        const data = res.data;
        setReference(data);
        // setLikeCount(data.likeCount || 0);
        // setComments(data.comments || []);
      })
      .catch(err => {
        console.error(err);
        alert('게시글 정보를 불러오는 데 실패했습니다.');
      });
  }, [fileId]);

  const handleFileDownload = async (fileUrl, originalFilename) => {
    try {
      const encodeUrl = encodeURIComponent(fileUrl);
      const encodeName = encodeURIComponent(originalFilename);

      const res = await fetch(`/public/download/reference?url=${encodeUrl}&originalFilename=${encodeName}`);
      if(!res.ok) throw new Error('다운로드 실패');

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = originalFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (e) {
      alert(e.message);
    }
  }

  // 뒤로가기
  const handleBackClick = () => {
    // console.log(reference);
    navigate('/main/reference', {state: {acaId:academyId, role, name}});
  };

  // 수정
  const handleEditClick = () => {
    navigate(`/main/reference/${fileId}/edit`, {state: {academyId, reference}});
  };

  // 삭제
  const handleDeleteClick =  async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }
    try {
      await axios.delete(`/th/${reference.id}/deleteReference`, {withCredentials: true});
      alert("자료실 글이 삭제되었습니다.");
      navigate('/main/reference', {state: {acaId: academyId, role, name}});
    } catch {
      alert("삭제 실패");
    }
  }

  // 댓글 등록
  const handleSubmit = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    axios.post(`/api/references/${fileId}/comments`, {
      author: currentUser,
      text: trimmed,
    })
      .then(res => {
        setComments(prev => [...prev, res.data]);
        setNewComment('');
      })
      .catch(() => {
        alert('댓글 등록 실패');
      });
  };

  // 좋아요 클릭
  const handleLikeClick = () => {
    if (liked) return;
    axios.post(`/api/references/${fileId}/like`)
      .then(() => {
        setLikeCount(prev => prev + 1);
        setLiked(true);
      })
      .catch(() => {
        alert('좋아요 실패');
      });
  };

  if (!reference) return <div>로딩 중...</div>;

  return (
    <div className="reference-detail-wrapper">
      <div className="reference-detail-container">
        <div className="header-box">
          <div className="header-inner">
            <button className="back-button" onClick={handleBackClick}>
              〈 목록
            </button>
          </div>
          <h2 className="post-title">{reference.title}</h2>
        </div>

        <div className="author-info-box">
          <div className="author-row">
            <span className="author">{reference.writer}</span>
            {name === reference.writer &&(
            <div className="actions">
              <button className="edit-button" onClick={handleEditClick}>
                수정
              </button>
              <button className="delete-button" onClick={handleDeleteClick}>
                삭제
              </button>
            </div>
            )}
          </div>
          <div className="date-views-row">
            <span className="date">{reference.createdAt?.substring(0, 10)}</span>
            <span className="views">조회 {reference.viewCount || 0}</span>
          </div>
        </div>

        <div className="content-box">
          {reference.files?.map((files, index) => {
            return (
              <div className="attachment" key={index}>
                <span className="attachment-link"
                 onClick={() => handleFileDownload(files.storedFilename, files.originalFilename)}>
                  📎 {files.originalFilename}
                </span>
              </div>
            );
          })}

          <div className="post-content" dangerouslySetInnerHTML={{ __html: reference.content }} />

          <hr className="separator" />

          <div className="like-comment-info">
            <button className={`like-button${liked ? ' liked' : ''}`} onClick={handleLikeClick}>
              <i className="bi bi-suit-heart-fill"></i> 좋아요 {likeCount}
            </button>
            <span className="comment-count">댓글 {comments.length}</span>
          </div>

          {/* 댓글 리스트 렌더링... (기존과 비슷하게) */}

          <div className="comment-write">
            <div className="comment-author-label">{currentUser}</div>
            <div className="comment-input-area">
              <input
                type="text"
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
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
