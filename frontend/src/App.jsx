import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ProfilePopupProvider } from './context/ProfilePopupContext';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import CommunityPage from './pages/CommunityPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import SearchResults from './pages/SearchResults';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <ProfilePopupProvider>
      <Layout>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/producto" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      </Layout>
    </ProfilePopupProvider>
  );
}

export default App;
