import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import DOMPurify from 'dompurify';
import './BoardMainPostDetail.css';

const formatKoreanDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date)) throw new Error('Invalid date');

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours < 12 ? '오전' : '오후';
    const formattedHours = hours % 12 || 12;

    return `${year}-${month}-${day} ${period} ${formattedHours}시 ${minutes}분`;
  } catch (error) {
    return dateString;
  }
};

const Comment = ({ comment, onUpdate, onDelete, userInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (editedContent.trim()) {
      onUpdate(comment.id, editedContent);
      setIsEditing(false);
    }
  };

  const canEditOrDelete = comment.author === userInfo.username || userInfo.role === '관리자';

  return (
    <div className="comment" key={comment.id}>
      <div className="comment-header">
        <div className="profileImage">이미지</div>
        <div className="comment-info">
          <div className="comment-author">
            {comment.author}
            {comment.role === '원장' && <span className="role-badge">원장</span>}
          </div>
          {isEditing ? (
            <textarea
              className="comment-edit-textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <div className="comment-content">{comment.content}</div>
          )}
        </div>
      </div>
      <div className="comment-footer">
        <div className="comment-date">{formatKoreanDate(comment.date)}</div>
        <div className="comment-actions">
          {canEditOrDelete && !isEditing && (
            <>
              <button className="action-btn" onClick={handleEditClick}>수정</button>
              <button className="action-btn" onClick={() => onDelete(comment.id)}>삭제</button>
            </>
          )}
          {isEditing && (
            <>
              <button className="action-btn" onClick={handleSaveEdit}>저장</button>
              <button className="action-btn" onClick={handleCancelEdit}>취소</button>
            </>
          )}
        </div>
      </div>
      <div className="comment-divider"></div>
    </div>
  );
};

const BoardMainPostDetail = () => {
  const { postId } = useParams();
  const userInfo = { username: '원장 테스트', role: '관리자' };
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const commentInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/public/api/board/${postId}`);
      setPost(response.data);
    } catch (error) {
      alert('게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/public/api/board/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      // 댓글 조회 실패 시 무시
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/public/api/board/${postId}/comments`, {
        content: newComment,
        author: userInfo.username,
        role: userInfo.role,
      }, { headers: { 'Content-Type': 'application/json' } });
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
    } catch (error) {
      alert('댓글 작성에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/public/api/board/${postId}/comments/${commentId}`);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } catch (error) {
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  const handleCommentUpdate = async (commentId, updatedContent) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/public/api/board/${postId}/comments/${commentId}`, {
        content: updatedContent,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, content: response.data.content } : comment
        )
      );
    } catch (error) {
      alert(`댓글 수정에 실패했습니다: ${error.response?.data?.message || '서버 오류입니다.'}`);
    }
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    navigate(`/main/post/BoardEditer?edit=${postId}`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/public/api/board/${postId}`);
        alert('게시글 삭제 성공');
        navigate('/main/board');
      } catch (error) {
        alert('게시글 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const adjustCommentInputPosition = () => {
    if (containerRef.current && commentInputRef.current) {
      const bodyElement = containerRef.current.querySelector('.detailMain-Body');
      const navElement = document.querySelector('.navi');
      const navWidth = navElement ? navElement.offsetWidth : 343;

      if (bodyElement) {
        const { top, left, width } = bodyElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const padding = 64;
        const extraWidth = navWidth === 80 ? 263 : 0;
        const maxWidth = width - padding;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        const newTop = containerRect.top + top + bodyElement.offsetHeight + scrollTop;

        commentInputRef.current.style.cssText = `
          position: absolute;
          top: ${newTop}px;
          left: ${left}px;
          max-width: ${maxWidth}px;
          width: ${maxWidth}px;
          transform: none;
          box-sizing: border-box;
        `;
      }
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Caprasimo&family=Edu+NSW+ACT+Hand+Pre:wght@400;500;600;700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap';
    link.rel = 'stylesheet';
    link.id = 'dynamic-google-fonts';
    document.head.appendChild(link);

    return () => {
      const existingLink = document.getElementById('dynamic-google-fonts');
      if (existingLink) document.head.removeChild(existingLink);
    };
  }, []);

  useEffect(() => {
    adjustCommentInputPosition();
    const handleResize = () => adjustCommentInputPosition();
    const handleScroll = () => adjustCommentInputPosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    const observer = new MutationObserver(adjustCommentInputPosition);
    const navElement = document.querySelector('.navi');
    if (navElement) {
      observer.observe(navElement, { attributes: true, attributeFilter: ['style'] });
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  if (!post) return <div>Loading...</div>;

  const sanitizedContent = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ['div', 'span', 'p', 'br', 'b', 'u', 'strong', 'i', 'em', 'font', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['style', 'class', 'size', 'face'],
    ALLOWED_STYLES: ['font-family', 'font-size', 'color', 'font-weight', 'text-decoration', 'text-align'],
    ADD_STYLE_RULES: [
      (style) => style.replace(/font-family:\s*([^;]+);?/, (match, fontFamily) => {
        const allowedFonts = ['Arial', 'Edu NSW ACT Hand Pre', 'Lato', 'Ubuntu', 'Caprasimo'];
        const cleanFont = fontFamily.replace(/['"]/g, '').split(',')[0].trim();
        return allowedFonts.includes(cleanFont) ? `font-family: ${cleanFont};` : 'font-family: Arial;';
      })
    ]
  });

  return (
    <div ref={containerRef} className="detailBoardcontainer">
      <h1 className="board-title11">학원 게시판</h1>
      <div className="detailMain-header">
        <div className="back-to-list">
          <span className="back-to-list-text" onClick={() => navigate('/main/board')}>⟨ 목록</span>
        </div>
        <div className="post-detail1">
          <div className="post-header-content">
            <h2 className="post-title">{post.title}</h2>
            <div className="post-menu" ref={dropdownRef}>
              <button className="menu-button" onClick={toggleDropdown}>⋯</button>
              {showDropdown && post && userInfo && (
                <div className="dropdown-menu">
                  {post.author && userInfo.username && post.author.trim() === userInfo.username.trim() && (
                    <button className="dropdown-item" onClick={handleEdit}>수정하기</button>
                  )}
                  {((post.author && userInfo.username && post.author.trim() === userInfo.username.trim()) || 
                    (userInfo.role && userInfo.role.trim() === '관리자')) && (
                    <button className="dropdown-item" onClick={handleDelete}>삭제하기</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="detailMain-Body">
        <div className="post-author">
          <div className="profileImage">이미지</div>
          <div className="author-info">
            <strong>{post.author}</strong>
            <div className="post-date">{formatKoreanDate(post.createdAt)}</div>
            {post.role === '원장' && <span className="role-badge">원장</span>}
          </div>
        </div>
        <div className="dividerHeader">
          {post.fileUrls && post.fileUrls.length > 0 && (
            <div className="attached-files">
              <h3>첨부 파일</h3>
              {post.fileUrls.map((url, index) => {
                const fileName = post.fileNames?.[index] || url.split('/').pop().split('?')[0] || `파일 ${index + 1}`;
                const cleanUrl = url.split('?')[0];
                const isImage = cleanUrl.toLowerCase().endsWith('.jpg') || 
                               cleanUrl.toLowerCase().endsWith('.png') || 
                               cleanUrl.toLowerCase().endsWith('.jpeg') || 
                               cleanUrl.toLowerCase().endsWith('.gif');
                return (
                  <div key={index} className="file-item">
                    {isImage ? (
                      <a
                        href={url}
                        download={fileName}
                        className="file-link"
                      >
                        <img src={url} alt={`Attached file ${index}`} className="attached-image" style={{ maxWidth: '100%', height: 'auto' }} />
                      </a>
                    ) : (
                      <a
                        href={url}
                        download={fileName}
                        className="file-link"
                      >
                        {fileName}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        <div className="divider"></div>
        <div className="comments-section">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onUpdate={handleCommentUpdate}
              onDelete={handleCommentDelete}
              userInfo={userInfo}
            />
          ))}
        </div>
      </div>
      <div ref={commentInputRef} className="comment-input-fixed">
        <div className="comment-input-box">
          <div className="comment-input-author">
            <span className="comment-author-name">{userInfo.username || '익명'}</span>
          </div>
          <textarea
            className="comment-input-field"
            placeholder="댓글을 작성해 주세요."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
          />
          <div className="comment-input-icons">            
            <button className="comment-input-submit" onClick={handleCommentSubmit}>등록</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardMainPostDetail;