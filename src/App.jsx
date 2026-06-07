import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import useEvents from './hooks/useEvents'

function App() {
  const { events, loading } = useEvents()

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage events={events} loading={loading} />} />
            <Route path="/calendar" element={<CalendarPage events={events} loading={loading} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
