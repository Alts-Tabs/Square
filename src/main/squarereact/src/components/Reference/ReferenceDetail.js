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

  // 게시글 상태
  const [reference, setReference] = useState(null);
  // 좋아요 상태
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // 게시글, 댓글, 좋아요 정보 API 호출
    axios.get(`/public/${fileId}/reference`)
      .then(res => {
        const data = res.data;
        setReference(data);
      })
      .catch(err => {
        console.error(err);
        alert('게시글 정보를 불러오는 데 실패했습니다.');
      });
    
     // 2. 좋아요 수
    axios.get(`/public/${fileId}/likes/countReference`, { withCredentials: true })
      .then(res => {
        setLikeCount(res.data);
      })
      .catch(err => {
        console.error('좋아요 수 로드 실패', err);
      });

    // 3. 좋아요 상태
    axios.get(`/student/${fileId}/likes/statusReference`, { withCredentials: true })
      .then(res => {
        setLiked(res.data);
      })
      .catch(err => {
        console.error('좋아요 상태 로드 실패', err);
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

  // 좋아요 클릭
  const handleLikeClick = () => {
    axios.post(`/student/${fileId}/likes/toggleReference`, {withCredentials: true})
      .then(res => {
        const newLiked = res.data;
        setLiked(newLiked);
        setLikeCount(prev => newLiked ? prev + 1 : prev - 1)
      })
      .catch(err => {
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferenceDetail;
