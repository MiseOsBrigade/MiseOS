import { useState, type ReactNode } from 'react'
import { BrigadeGallery } from './components/BrigadeGallery.js'
import { MasterRosterGallery } from './components/MasterRosterGallery.js'
import { ViteConsolePanel } from './components/ViteConsolePanel.js'
import { MASTER_ROSTER_CARDS } from './data/master-roster.js'

type Tab = 'master-roster' | 'registry-console' | 'brigade'

export default function App() {
  const [tab, setTab] = useState<Tab>('master-roster')

  return (
    <div className="app-shell">
      <nav className="app-tabs" aria-label="MiseOS registry console sections">
        <TabButton active={tab === 'master-roster'} onClick={() => setTab('master-roster')}>
          Master Roster ({MASTER_ROSTER_CARDS.length})
        </TabButton>
        <TabButton active={tab === 'registry-console'} onClick={() => setTab('registry-console')}>
          Registry Console
        </TabButton>
        <TabButton active={tab === 'brigade'} onClick={() => setTab('brigade')}>
          Brigade Gallery
        </TabButton>
      </nav>

      {tab === 'master-roster' ? <MasterRosterGallery /> : null}
      {tab === 'registry-console' ? <ViteConsolePanel /> : null}
      {tab === 'brigade' ? <BrigadeGallery /> : null}
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`app-tab ${active ? 'app-tab-active' : ''}`}>
      {children}
    </button>
  )
}
