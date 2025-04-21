import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import CommunityPage from './pages/CommunityPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/Login';
import SearchResults from './pages/SearchResults'; 

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/producto" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchResults />} />   {/* <-- agregá esto */}
        {/* Podés dejar o quitar el index, ya que "/" ya está declarado arriba */}
      </Routes>
    </Layout>
  );
}

export default App;