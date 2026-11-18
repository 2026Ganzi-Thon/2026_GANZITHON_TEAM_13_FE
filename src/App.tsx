import { Navigate, Route, Routes } from 'react-router-dom'
import { TabLayout } from './components/TabLayout'
import { Breathing } from './pages/Breathing'
import { Done } from './pages/Done'
import { Home } from './pages/Home'
import { LocationAsk } from './pages/LocationAsk'
import { LocationNone } from './pages/LocationNone'
import { MissionPick } from './pages/MissionPick'
import { MissionSuggest } from './pages/MissionSuggest'
import { Onboarding } from './pages/Onboarding'
import { Places } from './pages/Places'
import { Records } from './pages/Records'
import { Rest } from './pages/Rest'
import { Run } from './pages/Run'
import { Settings } from './pages/Settings'
import { Splash } from './pages/Splash'

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route index element={<Splash />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route element={<TabLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="records" element={<Records />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="mission/pick" element={<MissionPick />} />
        <Route path="mission/:place" element={<MissionSuggest />} />
        <Route path="run/:sessionId" element={<Run />} />
        <Route path="done" element={<Done />} />
        <Route path="rest" element={<Rest />} />
        <Route path="breathing" element={<Breathing />} />
        <Route path="location" element={<LocationAsk />} />
        <Route path="location/none" element={<LocationNone />} />
        <Route path="places" element={<Places />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
