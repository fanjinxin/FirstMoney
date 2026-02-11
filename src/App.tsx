import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import SCL90Test from './pages/scl90/SCL90Test'
import SCL90Result from './pages/scl90/SCL90Result'
import RPITest from './pages/rpi/RPITest'
import RPIResult from './pages/rpi/RPIResult'
import SRITest from './pages/sri/SRITest'
import SRIResult from './pages/sri/SRIResult'
import AnimalTest from './pages/animal/AnimalTest'
import AnimalResult from './pages/animal/AnimalResult'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scl90" element={<SCL90Test />} />
        <Route path="/scl90/result" element={<SCL90Result />} />
        <Route path="/rpi" element={<RPITest />} />
        <Route path="/rpi/result" element={<RPIResult />} />
        <Route path="/sri" element={<SRITest />} />
        <Route path="/sri/result" element={<SRIResult />} />
        <Route path="/animal" element={<AnimalTest />} />
        <Route path="/animal/result" element={<AnimalResult />} />
      </Routes>
    </Layout>
  )
}

export default App
