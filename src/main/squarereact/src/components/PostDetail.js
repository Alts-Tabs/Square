import React from 'react';
import './PostDetail.css';

const PostDetail = ({ username }) => {
  // 게시글 데이터 (실제로는 API에서 가져오거나 props로 전달받을 수 있음)
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
      content: "여기는 못골이 켜필 것.",
      date: "2025. 06. 14 15:07"
    },
    {
      id: 2,
      author: "여기는 아이디가 있을 것",
      role: "학생",
      content: "여기는 못골이 켜필 것.",
      date: "2025. 06. 14 15:07"
    },
    {
      id: 3,
      author: "용가뤼 원장",
      role: "원장",
      content: "못골을 창작해 주세요.",
      date: "2025. 06. 14 15:07"
    }
  ];

  return (
    <div className="detailBoardcontainer">
      <h1 className="board-title">학원 게시판</h1>
      
      <div className="back-to-list">
        <span>&lt; 목록</span>
      </div>
      
      <div className="post-detail">
        <h2 className="post-title">{post.title}</h2>
        
        <div className="post-author">
          <strong>{post.author}</strong>
          {post.role === "원장" && <span className="role-badge">원장</span>}
        </div>
        
        <div className="post-date">{post.date}</div>
        
        <div className="post-content">
          {post.content}
        </div>
      </div>
      
      <div className="divider"></div>
      
      <div className="comments-section">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-author">
              {comment.author}
              {comment.role === "원장" && <span className="role-badge">원장</span>}
            </div>
            <div className="comment-content">{comment.content}</div>
            <div className="comment-date">{comment.date}</div>
            <div className="comment-actions">
              <button className="action-btn">답글달기</button>
              <button className="action-btn">수정하기</button>
            </div>
            <div className="comment-divider"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetail;