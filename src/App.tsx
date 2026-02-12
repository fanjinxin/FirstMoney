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
import MBTITest from './pages/mbti/MBTITest'
import MBTIResult from './pages/mbti/MBTIResult'
import AATTest from './pages/aat/AATTest'
import AATResult from './pages/aat/AATResult'
import PsychAgeTest from './pages/psych-age/PsychAgeTest'
import PsychAgeResult from './pages/psych-age/PsychAgeResult'
import APTTest from './pages/apt/APTTest'
import APTResult from './pages/apt/APTResult'
import HITTest from './pages/hit/HITTest'
import HITResult from './pages/hit/HITResult'
import DTHTest from './pages/dth/DTHTest'
import DTHResult from './pages/dth/DTHResult'
import TLATest from './pages/tla/TLATest'
import TLAResult from './pages/tla/TLAResult'
import FFTTest from './pages/fft/FFTTest'
import FFTResult from './pages/fft/FFTResult'
import YBTTest from './pages/ybt/YBTTest'
import YBTResult from './pages/ybt/YBTResult'
import RVTTest from './pages/rvt/RVTTest'
import RVTResult from './pages/rvt/RVTResult'
import LBTTest from './pages/lbt/LBTTest'
import LBTResult from './pages/lbt/LBTResult'
import MPTTest from './pages/mpt/MPTTest'
import MPTResult from './pages/mpt/MPTResult'
import VBTTest from './pages/vbt/VBTTest'
import VBTResult from './pages/vbt/VBTResult'
import CityTest from './pages/city/CityTest'
import CityResult from './pages/city/CityResult'

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
        <Route path="/mbti" element={<MBTITest />} />
        <Route path="/mbti/result" element={<MBTIResult />} />
        <Route path="/aat" element={<AATTest />} />
        <Route path="/aat/result" element={<AATResult />} />
        <Route path="/psych-age" element={<PsychAgeTest />} />
        <Route path="/psych-age/result" element={<PsychAgeResult />} />
        <Route path="/apt" element={<APTTest />} />
        <Route path="/apt/result" element={<APTResult />} />
        <Route path="/hit" element={<HITTest />} />
        <Route path="/hit/result" element={<HITResult />} />
        <Route path="/dth" element={<DTHTest />} />
        <Route path="/dth/result" element={<DTHResult />} />
        <Route path="/tla" element={<TLATest />} />
        <Route path="/tla/result" element={<TLAResult />} />
        <Route path="/fft" element={<FFTTest />} />
        <Route path="/fft/result" element={<FFTResult />} />
        <Route path="/ybt" element={<YBTTest />} />
        <Route path="/ybt/result" element={<YBTResult />} />
        <Route path="/rvt" element={<RVTTest />} />
        <Route path="/rvt/result" element={<RVTResult />} />
        <Route path="/lbt" element={<LBTTest />} />
        <Route path="/lbt/result" element={<LBTResult />} />
        <Route path="/mpt" element={<MPTTest />} />
        <Route path="/mpt/result" element={<MPTResult />} />
        <Route path="/vbt" element={<VBTTest />} />
        <Route path="/vbt/result" element={<VBTResult />} />
        <Route path="/city" element={<CityTest />} />
        <Route path="/city/result" element={<CityResult />} />
      </Routes>
    </Layout>
  )
}

export default App
