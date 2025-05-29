import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import ReportIssue from './pages/ReportIssue';
import AdminDashboard from './pages/AdminDashboard';
import CommunityHub from './pages/CommunityHub';
import ChatSupport from './pages/ChatSupport';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/community" element={<CommunityHub />} />
          <Route path="/chat" element={<ChatSupport />} />
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;