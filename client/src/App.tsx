import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          {/* Future routes: /about, /sermons, /events */}
        </Route>
        
        {/* Future Admin & Portal Routes will go here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
