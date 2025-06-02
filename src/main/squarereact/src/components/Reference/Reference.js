import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './reference.css';

const Reference = () => {
  const navigate = useNavigate();

  const [folders, setFolders] = useState([
    { name: '모의고사', children: ['고2', '고3', '3월 모의고사'] },
  ]);
  const [selectedFolder, setSelectedFolder] = useState('3월 모의고사');
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedFiles, setCheckedFiles] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [allChecked, setAllChecked] = useState(false);
  const filesPerPage = 10;

  const [allFiles, setAllFiles] = useState(() => {
    const files = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      filename: `${i + 1}번 파일 예시`,
      author: '김영어',
      uploadDate: '2025.05.23',
      size: (i + 1) % 2 === 0 ? '8 MB' : '1.5 GB',
    }));
    return files.sort((a, b) => b.id - a.id);
  });

  const filteredFiles = allFiles.filter(file => file.filename.includes(searchTerm));
  const pagedFiles = filteredFiles.slice(
    (currentPage - 1) * filesPerPage,
    currentPage * filesPerPage
  );

  const addFolder = () => {
    const name = prompt('추가할 폴더명을 입력하세요.');
    if (!name || name.trim() === '') return;
    setFolders(prev =>
      prev.map(folder =>
        folder.name === '모의고사' && !folder.children.includes(name)
          ? { ...folder, children: [...folder.children, name] }
          : folder
      )
    );
  };

  const onSelectFolder = name => {
    setSelectedFolder(name);
    setSearchTerm('');
    setCheckedFiles(new Set());
    setAllChecked(false);
    setCurrentPage(1);
  };

  const onDeleteFolder = (e, name) => {
    e.preventDefault();
    if (!window.confirm(`폴더 "${name}"를 삭제하시겠습니까?`)) return;
    setFolders(prev =>
      prev.map(folder =>
        folder.name === '모의고사'
          ? {
              ...folder,
              children: folder.children.filter(child => child !== name),
            }
          : folder
      )
    );
    if (selectedFolder === name) setSelectedFolder('');
  };

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

  const onDeleteFiles = () => {
    if (checkedFiles.size === 0) return alert('삭제할 파일을 선택하세요.');
    if (!window.confirm('선택한 파일을 삭제하시겠습니까?')) return;

    setAllFiles(prev => prev.filter(file => !checkedFiles.has(file.id)));
    setCheckedFiles(new Set());
    setAllChecked(false);
  };

  const onSearchChange = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setCheckedFiles(new Set());
    setAllChecked(false);
  };

  const onPageClick = page => {
    setCurrentPage(page);
    setCheckedFiles(new Set());
    setAllChecked(false);
  };

  const onWriteClick = () => navigate('/main/reference/write');
  const onFileClick = id => navigate(`/main/reference/${id}`);

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
                <li key={folder.name}>
                  {folder.name}
                  <ul>
                    {folder.children.map(child => (
                      <li
                        key={child}
                        className={child === selectedFolder ? 'selected-folder' : ''}
                        onClick={() => onSelectFolder(child)}
                        onContextMenu={e => onDeleteFolder(e, child)}
                      >
                        {child}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="reference-main">
          <div className="reference-actions">
            <button className="write-btn" onClick={onWriteClick}>글작성</button>
            <button className="delete-btn" onClick={onDeleteFiles}>삭제</button>
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
                  <th><input type="checkbox" checked={allChecked} onChange={onCheckAll} /></th>
                  <th>번호</th>
                  <th>파일명</th>
                  <th>작성자</th>
                  <th>업로드일</th>
                  <th>용량</th>
                </tr>
              </thead>
              <tbody>
                {pagedFiles.length > 0 ? (
                  pagedFiles.map(file => (
                    <tr key={file.id} onClick={() => onFileClick(file.id)} style={{ cursor: 'pointer' }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={checkedFiles.has(file.id)}
                          onClick={e => e.stopPropagation()}
                          onChange={() => onCheckFile(file.id)}
                        />
                      </td>
                      <td>{file.id}</td>
                      <td>{file.filename}</td>
                      <td>{file.author}</td>
                      <td>{file.uploadDate}</td>
                      <td>{file.size}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center' }}>검색 결과가 없습니다.</td></tr>
                )}
              </tbody>
            </table>

            <div className="reference-pagination">
              {[...Array(Math.ceil(filteredFiles.length / filesPerPage))].map((_, i) => (
                <span
                  key={i}
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
