import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BoardMainPage.css';

const BoardMainPage = ({ username }) => {
  const [activeTab, setActiveTab] = useState('공지사항');
  const navigate = useNavigate();

  // 공지사항 데이터 (고유 ID로 수정, 빈 데이터 유지)
  const noticePosts = [
    { id: 23, title: '수업 OT 필참 공지', author: '용가뤼 (원장)', date: '2025-05-13', views: 45 },
    { id: 22, title: '', author: '', date: '', views: '' },
    { id: 21, title: '', author: '', date: '', views: '' },
    { id: 20, title: '', author: '', date: '', views: '' },
    { id: 19, title: '', author: '', date: '', views: '' },
    { id: 18, title: '', author: '', date: '', views: '' },
    { id: 17, title: '', author: '', date: '', views: '' },
    { id: 16, title: '', author: '', date: '', views: '' },
    { id: 15, title: '', author: '', date: '', views: '' },
    { id: 14, title: '', author: '', date: '', views: '' },
    { id: 13, title: '', author: '', date: '', views: '' },
    { id: 12, title: '', author: '', date: '', views: '' },
    { id: 11, title: '', author: '', date: '', views: '' },
    { id: 11, title: '', author: '', date: '', views: '' },
    { id: 11, title: '', author: '', date: '', views: '' },
    { id: 11, title: '', author: '', date: '', views: '' },
    { id: 11, title: '', author: '', date: '', views: '' },
  ];

  // 자유게시판 데이터
  const freePosts = [
    { id: 15, title: '과제 질문 있습니다', author: '학생A', date: '2025-05-12', views: 20 },
    { id: 14, title: '모임 하실 분?', author: '학생B', date: '2025-05-11', views: 35 },
    { id: 13, title: '', author: '', date: '', views: '' },
  ];

  // 페이징 번호
  const pageNumbers = [1, 2, 3, 4, 5];
  const currentPage = 3;

  const handleWriteClick = () => {
    navigate('/post/create');
  };

  // 게시글 데이터 필터링 함수
const getFilteredPosts = (posts) => {
  return posts.filter(post => post.title || post.author || post.date || post.views);
};

  return (
    <div className="boardMainTable">
      {/* 제목 */}
      <div className="label">
        <div className="text-wrapper">학원 게시판</div>
      </div>
      {/* 탭 메뉴 */}
      <div className="tab-container">
        <div className="menu overlap-group">
          <div
            className={`tab-btn ${activeTab === '공지사항' ? 'active' : ''}`}
            onClick={() => setActiveTab('공지사항')}
          >
            공지사항
          </div>
          <div
            className={`tab-btn ${activeTab === '자유 게시판' ? 'active' : ''}`}
            onClick={() => setActiveTab('자유 게시판')}
          >
            자유 게시판
          </div>
        </div>
      </div>

      {/* 서브 타이틀 + 글쓰기 */}
      <div className="sub-header">
        <div>
          <span className="sub-title">{activeTab}</span>
          <span className="sub-desc">
            {activeTab === '공지사항'
              ? '전체 공지사항 게시판입니다.'
              : '전체 자유게시판입니다.'}
          </span>
        </div>
        <button className="write-button" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>

      {/* 게시글 테이블 */}
      <div className="table-wrapper">
        <table className="post-table scrollable-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === '공지사항' ? noticePosts : freePosts).map((post, idx) => (
              <tr key={post.id || idx}>
                <td data-label="번호">{post.id || ''}</td>
                <td data-label="제목">
                  {post.title ? <Link to={`/post/${post.id}`}>{post.title}</Link> : ''}
                </td>
                <td data-label="작성자">{post.author || ''}</td>
                <td data-label="작성일">{post.date || ''}</td>
                <td data-label="조회수">{post.views || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이징 + 검색 */}
      <div className="pagination-container">
        <div className="pagination">
          <span>&lt;</span>
          {pageNumbers.map((num) => (
            <span key={num} className={num === currentPage ? 'active' : ''}>
              {num}
            </span>
          ))}
          <span>&gt;</span>
        </div>
      </div>
      <br />
      <div className="search-container">
        <select className="search-select">
          <option>제목 + 내용</option>
          <option>제목</option>
          <option>내용</option>
        </select>
        <input type="text" placeholder="게시판 검색" className="search-input" />
        <button className="search-button">🔍</button>
      </div>
    </div>
  );
};

export default BoardMainPage;