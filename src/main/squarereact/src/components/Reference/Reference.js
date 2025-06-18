import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './reference.css';
import axios from 'axios';

const Reference = () => {
  // 유저 정보 받아오기
  const location = useLocation();
  const academyId = location.state?.acaId; // 소속 학원 PK
  const role = location.state?.role;
  const name = location.state?.name;

  const roleCheck = role === "원장" || role === "강사";
  const navigate = useNavigate();

  const [folders, setFolders] = useState([]); // 카테고리 목록
  const [selectedFolder, setSelectedFolder] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedFiles, setCheckedFiles] = useState(new Set());
  const [allChecked, setAllChecked] = useState(false);
  const [allFiles, setAllFiles] = useState([]);
  const filesPerPage = 10;

  // 자료 목록 조회
  const fileList = useCallback(() => {
    axios.get(`/public/${academyId}/getFiles`, { withCredentials: true })
      .then(res => {
        setAllFiles(res.data);
      })
      .catch(err => {
        alert("자료실 글 목록 로딩에 실패했습니다.");
      });
  }, [academyId]);

  // 카테고리 목록 조회
  const CategoryList = useCallback(() => {
    axios.get(`/public/${academyId}/category`, { withCredentials: true })
      .then(res => {
        setFolders(res.data);
      })
      .catch(err => {
        alert("자료실 카테고리 로딩에 실패했습니다.");
      });
  }, [academyId]);

  useEffect(() => {
    fileList();
    CategoryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 필터링, 페이징
  const filteredFiles = allFiles.filter(file =>{
    const matchesSearch = file?.title?.includes(searchTerm);
    const matchesCategory = selectedFolder ? file?.category === selectedFolder : true;
    return matchesSearch && matchesCategory;
    // file?.title?.includes(searchTerm)
  });

  const pagedFiles = filteredFiles.slice(
    (currentPage - 1) * filesPerPage,
    currentPage * filesPerPage
  );

  // 체크박스
  const onCheckFile = id => {
    setCheckedFiles(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      setAllChecked(newSet.size === pagedFiles.length && pagedFiles.length > 0);
      return newSet;
    });
  };

  const onCheckAll = () => {
    if (allChecked) {
      setCheckedFiles(new Set());
      setAllChecked(false);
    } else {
      const newSet = new Set(pagedFiles.map(f => f.id));
      setCheckedFiles(newSet);
      setAllChecked(true);
    }
  };

  const onDeleteFiles = async () => {
    if (checkedFiles.size === 0) return alert('삭제할 파일을 선택하세요.');
    if (!window.confirm('선택한 파일을 삭제하시겠습니까?')) return;

    try {
      const idsToDelete = Array.from(checkedFiles);
      await Promise.all(
        idsToDelete.map(id =>
          axios.delete(`/th/${id}/deleteReference`, { withCredentials: true })
        )
      );

      setAllFiles(prev => prev.filter(file => !checkedFiles.has(file.id)));
      setCheckedFiles(new Set());
      setAllChecked(false);
    } catch(err) {
      alert("자료 삭제를 실패했습니다");
    }
  };

  // 폴더 관리
  const addFolder = async () => {
    const name = prompt('추가할 폴더명을 입력하세요.');
    if (!name || name.trim() === '') return;
    if(folders.some(f => f.category === name)) {
      alert('이미 존재하는 폴더명입니다.');
      return;
    }

    try {
      await axios.post(`/th/${academyId}/createCategory`, null, {
        params: {
          "categoryName":name
        },
        withCredentials: true 
      });
      setFolders(prev => [...prev, {category: name}]);  
    } catch (err) {
      alert('카테고리 생성 실패.');
    }
  };

  const [prevName, setPrevName] = useState("");
  const onSelectFolder = (name) => {
    if(prevName === name && prevName !== "") {
      setSelectedFolder();
      setPrevName("");
      return;
    }
    setSelectedFolder(name);
    setPrevName(name);
    // setSearchTerm('');
    setCheckedFiles(new Set());
    setAllChecked(false);
    setCurrentPage(1);
  };

  const onDeleteFolder = async (e, idx, name) => {
    e.preventDefault();
    
    if (!window.confirm(`폴더 "${name}"를 삭제하시겠습니까?`)) return;
    try {
      await axios.delete(`/th/${idx}/deleteCategory`, {withCredentials: true});

      setFolders(prev => prev.filter(f => f.category !== name));
      if (selectedFolder === name) setSelectedFolder('');
    } catch(err) {
      alert("폴더 삭제 실패");
    }
  };

  // 검색
  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setCheckedFiles(new Set());
    setAllChecked(false);
    // setSelectedFolder();
  };

  // 페이지네이션
  const onPageClick = (page) => {
    setCurrentPage(page);
    setCheckedFiles(new Set());
    setAllChecked(false);
  };

  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

  // 네비게이션
  const onWriteClick = () => navigate('/main/reference/write', {state: {academyId, role, name}});
  const onFileClick = id => navigate(`/main/reference/${id}`, {state: {academyId, role, name}});

  return (
    <div className="contents">
      <div className="title">자료실</div>
      <div className="reference-body">
        <div className="reference-sidebar">
          <div className="reference-folder-box">
            <div className="reference-folder-title">
              폴더 목록
              <button className="folder-add-btn" onClick={addFolder}>+</button>
            </div>
            <ul className="folder-list">
              {folders.map(folder => (
                <li key={folder.idx}
                 className={folder.category === selectedFolder ? 'selected-folder' : ''}
                 onClick={() => onSelectFolder(folder.category)}
                 onContextMenu={e => onDeleteFolder(e, folder.idx, folder.category)}>
                  {folder.category}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="reference-main">
          <div className="reference-actions">
            {roleCheck && <>
              <button className="write-btn" onClick={onWriteClick}>글작성</button>
              <button className="delete-btn" onClick={onDeleteFiles}>삭제</button>
            </>}
            <div className="search-box">
              <input
                type="text"
                placeholder="자료실 검색"
                value={searchTerm}
                onChange={onSearchChange}
              />
              <i className="bi bi-search search-icon"></i>
            </div>
          </div>

          <div className="reference-table-box">
            <table className="reference-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={onCheckAll}
                    />
                  </th>
                  <th>번호</th>
                  <th>파일명</th>
                  <th>작성자</th>
                  <th>업로드일</th>
                </tr>
              </thead>
              <tbody>
                {pagedFiles.length > 0 ? (
                  pagedFiles.map((file, idx) => (
                    <tr key={file.id} onClick={() => onFileClick(file.id)} style={{ cursor: 'pointer' }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={checkedFiles.has(file.id)}
                          onClick={e => e.stopPropagation()}
                          onChange={() => onCheckFile(file.id)}
                        />
                      </td>
                      <td>{idx+1 ?? '-'}</td>
                      <td>{file.title ?? '-'}</td>
                      <td>{file.writer ?? '-'}</td>
                      <td>{file.createdAt ?? '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>검색 결과가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="reference-pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <span
                  key={i + 1}
                  className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => onPageClick(i + 1)}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reference;
