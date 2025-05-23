import React, { useState, useEffect, useRef } from 'react';
import './QnABoardMainPostDetail.css';

const PostDetail = ({ username }) => {
  const containerRef = useRef(null);
  const commentInputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 댓글 입력창 위치 조정 함수
  const adjustCommentInputPosition = () => {
    if (containerRef.current && commentInputRef.current) {
      // detailMain-Body를 기준으로 위치와 크기 계산
      const bodyElement = containerRef.current.querySelector('.detailMain-Body');
      if (bodyElement) {
        const bodyRect = bodyElement.getBoundingClientRect();
        const commentInput = commentInputRef.current;
        
        // detailMain-Body의 콘텐츠 영역과 동일한 left 위치와 width 설정
        // padding 32px를 고려하여 실제 콘텐츠 영역에 맞춤
        commentInput.style.left = `${bodyRect.left + 30}px`;
        commentInput.style.width = `${bodyRect.width - 50}px`; // 좌우 패딩 32px씩 제외
        commentInput.style.maxWidth = 'none';
        commentInput.style.transform = 'none';
      }
    }
  };

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    // 초기 위치 설정
    adjustCommentInputPosition();
    
    // 창 크기 변경 시 위치 재조정
    const handleResize = () => {
      adjustCommentInputPosition();
    };
    
    window.addEventListener('resize', handleResize);
    
    // cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 드롭다운 토글 함수
  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle dropdown clicked, current state:', showDropdown);
    setShowDropdown(prev => !prev);
  };

  // 수정하기 클릭 핸들러
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();    
    setShowDropdown(false);
    // 여기에 수정 로직 추가
  };

  // 삭제하기 클릭 핸들러
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();    
    setShowDropdown(false);
    // 여기에 삭제 로직 추가
  };

  // 게시글 데이터
  const post = {
    title: "작성 게시글 제목",
    author: username ? username.name : "익명",
    date: "2025. 05. 14 15:07",
    content: "내용 들어갈 공간",
    role: username ? username.role : "학생"
  };

  // 댓글 데이터
  const comments = [
    {
      id: 1,
      author: "여기는 아이디가 있을 것",
      role: "학생",
      content: "여기는 댓글이 있을 것.",
      date: "2025. 06. 14 15:07"
    },
    {
      id: 2,
      author: "여기는 아이디가 있을 것",
      role: "학생",
      content: "여기는 댓글이 있을 것.",
      date: "2025. 06. 14 15:07"
    },
    {
      id: 3,
      author: "용가뤼 원장",
      role: "원장",
      content: "여기는 댓글이 있을 것.",
      date: "2025. 06. 14 15:07"
    }
  ];

  return (
    <>
      <div ref={containerRef} className="detailBoardcontainer">
        <h1 className="board-title11">상담신청 및 QnA 게시판</h1>
        <div className='detailMain-header'>
          <div className="back-to-list">
            <span className="back-to-list-text">&lt; 목록</span>
          </div>            
          <div className="post-detail1">
            <div className="post-header-content">
              <h2 className="post-title">{post.title}</h2>
              <div className="post-menu" ref={dropdownRef}>
                <button 
                  className="menu-button" 
                  onClick={toggleDropdown}
                  type="button"
                >
                  ⋯
                </button>
                {showDropdown && (
                  <div className="dropdown-menu" style={{ display: showDropdown ? 'block' : 'none' }}>
                    <button className="dropdown-item" onClick={handleEdit} type="button">
                      수정하기
                    </button>
                    <button className="dropdown-item" onClick={handleDelete} type="button">
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='detailMain-Body'>        
          <div className="post-author">
            <div className="profileImage">이미지</div>
            <div className="author-info">
              <strong>{post.author}</strong>
              <div className="post-date">{post.date}</div>
              {post.role === "원장" && <span className="role-badge">원장</span>}
            </div>
          </div>
          <div className="dividerHeader"></div>       
          <div className="post-content">
            {post.content}
          </div>     
          <div className="divider"></div>     
          <div className="comments-section">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <div className="profileImage">이미지</div>
                  <div className="comment-info">
                    <div className="comment-author">
                      {comment.author}
                      {comment.role === "원장" && <span className="role-badge">원장</span>}
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                </div>
                <div className="comment-footer">
                  <div className="comment-date">{comment.date}</div>
                  <div className="comment-actions">
                    <button className="action-btn">답글쓰기</button>
                    <span className="comment-heart">♡</span>
                    <button className="action-btn">수정</button>
                    <button className="action-btn">삭제</button>
                  </div>
                </div>
                <div className="comment-divider"></div>
              </div>
            ))}
          </div>
        </div>        
      </div>
      
      {/* 댓글 입력창을 별도로 분리 */}
      <div ref={commentInputRef} className="comment-input-fixed">          
        <div className="comment-input-box">
          <div className="comment-input-author">
            <span className="comment-author-name">작성자 닉네임</span>
          </div>
          <textarea 
            className="comment-input-field" 
            placeholder="댓글을 작성해 주세요."
            rows="3"
          />
          <div className="comment-input-icons">
            <button className="comment-icon-btn"><span role="img" aria-label="사진"><i className="bi bi-file-earmark-image"></i></span></button>
            <button className="comment-icon-btn"><span role="img" aria-label="이모지"><i className="bi bi-emoji-smile"></i></span></button>
            <button className="comment-input-submit">등록</button>
          </div>          
        </div>
      </div>
    </>
  );
};

export default PostDetail;