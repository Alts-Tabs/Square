// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TotalEvaluationsAdmin from './evaluations/TotalEvaluationsAdmin';
// import BoardMainPage from './components/BoardMainPage';
// import PostDetail from './components/PostDetail';
// import PostForm from './components/PostForm';

function App() {
//   const username = { name: "user1", role: "parents" };
  return (
    <div className="App">
      <p>PR 테스트</p>
      <TotalEvaluationsAdmin />
    </div>
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<BoardMainPage username={username} />} />
    //     <Route path="/post/:postId" element={<PostDetail username={username} />} />
    //     <Route path="/create" element={<PostForm username={username} />} />
    //   </Routes>
    // </Router>
  );
}

export default App;