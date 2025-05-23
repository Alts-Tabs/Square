import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './QnABoardMainPage.css';

const BoardMainPage = ({ username }) => {
  const [activeTab, setActiveTab] = useState('상담신청');
  const navigate = useNavigate();
  const location = useLocation();

  const [consultingPosts, setConsultingPosts] = useState([
    { id: 23, title: '상담 신청 합니다', author: 'A학부모', date: '2025-05-13', views: 3, category: 'consulting' },
    { id: 24, title: '상담 신청 합니다', author: 'B학부모', date: '2025-05-13', views: 4, category: 'consulting' },
    { id: 25, title: '상담 신청 합니다', author: 'C학부모', date: '2025-05-14', views: 6, category: 'consulting' },
    { id: 26, title: '상담 신청 합니다', author: 'D학부모', date: '2025-05-14', views: 1, category: 'consulting' },
    { id: 27, title: '상담 신청 합니다', author: 'E학부모', date: '2025-05-15', views: 1, category: 'consulting' },
    { id: 28, title: '상담 신청 합니다', author: 'F학부모', date: '2025-05-15', views: 4, category: 'consulting' },
    { id: 29, title: '상담 신청 합니다', author: 'G학부모', date: '2025-05-15', views: 2, category: 'consulting' },
    { id: 30, title: '상담 신청 합니다', author: 'H학부모', date: '2025-05-15', views: 6, category: 'consulting' },
    { id: 31, title: '상담 신청 합니다', author: 'I학부모', date: '2025-05-15', views: 3, category: 'consulting' },
    { id: 32, title: '상담 신청 합니다', author: 'G학부모', date: '2025-05-16', views: 2, category: 'consulting' },
    { id: 33, title: '상담 신청 합니다', author: 'K학부모', date: '2025-05-17', views: 5, category: 'consulting' },
    { id: 34, title: '상담 신청 합니다', author: 'L학부모', date: '2025-05-17', views: 1, category: 'consulting' },
  ]);

  const [qnAPosts, setQnAPosts] = useState([
    { id: 13, title: '학원 휴무 언제인가요?', author: '학생A', date: '2025-05-12', views: 20, category: 'qna' },
    { id: 14, title: '모임 하실 분?', author: '학생B', date: '2025-05-11', views: 35, category: 'qna' },
    { id: 15, title: '과제 질문 있습니다', author: '학생A', date: '2025-05-12', views: 20, category: 'qna' },
  ]);

  const [faqPosts, setFaqPosts] = useState([
    { id: 1, title: '수업 시간은 어떻게 되나요?', author: '관리자', date: '2025-05-10', views: 50, category: 'faq' },
    { id: 2, title: '환불 정책은 무엇인가요?', author: '관리자', date: '2025-05-10', views: 30, category: 'faq' },
  ]);

  // 새 게시글을 상태에 추가
  useEffect(() => {
    const { newPost } = location.state || {};
    if (newPost) {
      switch (newPost.category) {
        case 'consulting':
          setConsultingPosts((prev) => [newPost, ...prev]);
          setActiveTab('상담신청');
          break;
        case 'qna':
          setQnAPosts((prev) => [newPost, ...prev]);
          setActiveTab('QnA게시판');
          break;
        case 'faq':
          setFaqPosts((prev) => [newPost, ...prev]);
          setActiveTab('FAQ게시판');
          break;
        default:
          break;
      }
      // 상태 초기화 (중복 추가 방지)
      navigate('/qnaboard', { state: {}, replace: true });
    }
  }, [location.state, navigate]);

  const pageNumbers = [1, 2, 3, 4, 5];
  const currentPage = 3;

  const handleWriteClick = () => {
    navigate('../post/qnacreate', { state: { category: activeTab } });
  };

  const getPosts = () => {
    switch (activeTab) {
      case '상담신청':
        return consultingPosts;
      case 'QnA게시판':
        return qnAPosts;
      case 'FAQ게시판':
        return faqPosts;
      default:
        return [];
    }
  };

  return (
    <div className="boardMainTable">
      <div className="boardMainTitle">상담신청 및 QnA 게시판</div>
      <div className="boardMainTab">
        <div className="boardMainTab overlap-group">
          <div
            className={`boardMainTabButton ${activeTab === '상담신청' ? 'active' : ''}`}
            onClick={() => setActiveTab('상담신청')}
          >
            상담 신청
          </div>
          <div
            className={`boardMainTabButton ${activeTab === 'QnA게시판' ? 'active' : ''}`}
            onClick={() => setActiveTab('QnA게시판')}
          >
            QnA게시판
          </div>
          <div
            className={`boardMainTabButton ${activeTab === 'FAQ게시판' ? 'active' : ''}`}
            onClick={() => setActiveTab('FAQ게시판')}
          >
            FAQ게시판
          </div>
        </div>
      </div>
      <div className="boardMainSubHeader">
        <div>
          <span className="boardMainSubTitle">{activeTab}</span>
          <span className="boardMainSubDesc">
            {activeTab === '상담신청'
              ? '상담 신청 관련 게시판입니다.'
              : activeTab === 'QnA게시판'
              ? '질문과 답변을 위한 게시판입니다.'
              : '자주 묻는 질문 게시판입니다.'}
          </span>
        </div>
        <button className="boardMainWriteButton" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>
      <div className="table-wrapper boardMainTable">
        <table className="post-table scrollable-table boardMain">
          <thead>
            <tr>
              <th style={{ width: '10%', borderRight: '1px solid #4da1a9' }}>번호</th>
              <th style={{ width: '40%', borderRight: '1px solid #4da1a9' }}>제목</th>
              <th style={{ width: '18%', borderRight: '1px solid #4da1a9' }}>작성자</th>
              <th style={{ width: '20%', borderRight: '1px solid #4da1a9' }}>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {getPosts().length > 0 ? (
              getPosts().map((post, idx) => (
                <tr key={post.id || idx}>
                  <td data-label="번호">{post.id || ''}</td>
                  <td data-label="제목">
                    {post.title ? (
                      <Link to={`../post/${post.category}/${post.id}`}>{post.title}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td data-label="작성자">{post.author || ''}</td>
                  <td data-label="작성일">{post.date || ''}</td>
                  <td data-label="조회수">{post.views || ''}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-container boardMain">
        <div className="boardMainPagination">
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
      <div className="search-container boardMain">
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