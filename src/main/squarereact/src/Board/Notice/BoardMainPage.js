import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import './BoardMainPage.css';

const BoardMainPage = () => {
  const defaultUserInfo = useOutletContext() || { username: null, role: null };
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('공지사항');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchType, setSearchType] = useState('title+content');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(defaultUserInfo);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/public/user", { withCredentials: true });
        const { name, role, username, acaId, userId, roleId, academyName } = response.data;
        setUserInfo({ name, role, username, acaId, userId, roleId, academyName });
      } catch (error) {        
        setUserInfo({ username: null, role: null });
      }
    };
    fetchUserInfo();
  }, []);

  const fetchPosts = useCallback(async (category, pageNum, keyword = '') => {
  setIsLoading(true);
  try {    
    const response = await axios.get(`/public/api/board`, {
      params: { 
        category, 
        page: pageNum, 
        size: 10, 
        ...(keyword && { keyword, searchType }), 
        sort: 'id,desc'
      },
    });    
    setPosts(response.data.content || []);
    setTotalPages(response.data.totalPages || 1);
  } catch (error) {    
    alert('게시글을 불러오는 데 실패했습니다.');
    setPosts([]);
    setTotalPages(1);
  } finally {
    setIsLoading(false);
  }
}, [searchType]);

  useEffect(() => {    
    if (userInfo.username) {
      fetchPosts(activeTab, page);
    } else {
      setIsLoading(false);
    }
  }, [activeTab, page, fetchPosts, userInfo.username]);

  const handleSearch = () => {
    setPage(1);
    fetchPosts(activeTab, 1, searchKeyword);
  };

  const handleWriteClick = () => {    
    if (!userInfo.username) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate(`/main/post/boardcreate?category=${encodeURIComponent(activeTab)}`);
  };

  const getPageNumbers = () => {
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="boardMainTable">
      <h1 className="boardMainTitle">학원 게시판</h1>
      <div className="boardMainTab">
        <div className="boardMainTab overlap-group">
          <button
            className={`boardMainTabButton ${activeTab === '공지사항' ? 'active' : ''}`}
            onClick={() => { setActiveTab('공지사항'); setPage(1); }}
          >
            공지사항
          </button>
          <button
            className={`boardMainTabButton ${activeTab === '자유게시판' ? 'active' : ''}`}
            onClick={() => { setActiveTab('자유게시판'); setPage(1); }}
          >
            자유게시판
          </button>
          <button
            className={`boardMainTabButton ${activeTab === 'FAQ' ? 'active' : ''}`}
            onClick={() => { setActiveTab('FAQ'); setPage(1); }}
          >
            FAQ
          </button>
        </div>
      </div>
      <div className="boardMainSubHeader">
        <div>
          <h2 className="boardMainSubTitle">{activeTab}</h2>
          <p className="boardMainSubDesc">
            {activeTab === '공지사항' ? '전체 공지사항 게시판입니다.' : 
             activeTab === '자유게시판' ? '전체 자유게시판입니다.' : 
             '자주 묻는 질문 게시판입니다.'}
          </p>
        </div>
        <button className="boardMainWriteButton" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>
      <div className="table-wrapper boardMainTable">
        <table className="post-table boardMain">
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
            {posts.length === 0 ? (
              <tr><td colSpan="5">게시글이 없습니다.</td></tr>
            ) : (
              posts.map((post, index) => (
                <tr key={post.id}>
                  <td data-label="번호">{(page - 1) * 10 + index + 1}</td>
                  <td data-label="제목"><Link to={`/main/board/${post.id}`}>{post.title}</Link></td>
                  <td data-label="작성자">{post.author}</td>
                  <td data-label="작성일">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td data-label="조회수">{post.views}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-search-container">
        {totalPages > 1 && (
          <div className="pagination-container boardMain">
            <div className="boardMainPagination">
              <span onClick={() => setPage(page - 1)} className={page === 1 ? 'disabled' : ''}>&lt;</span>
              {getPageNumbers().map(num => (
                <span
                  key={num}
                  className={num === page ? 'active' : ''}
                  onClick={() => setPage(num)}
                >
                  {num}
                </span>
              ))}
              <span onClick={() => setPage(page + 1)} className={page === totalPages ? 'disabled' : ''}>&gt;</span>
            </div>
          </div>
        )}
        <div className="search-container boardMain">
          <select
            className="search-select"
            value={searchType}
            onChange={e => setSearchType(e.target.value)}
          >
            <option value="title+content">제목 + 내용</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <input
            type="text"
            placeholder="게시판 검색"
            className="search-input"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>🔍</button>
        </div>
      </div>
    </div>
  );
};

export default BoardMainPage;