import { useState } from 'react'
import './App.css'
import SeoulMap from './components/SeoulMap'
import Bookshelf from './components/Bookshelf'
import useLibraries, { type Library } from './hooks/useLibraries'

function App() {
  const { idToLibrary } = useLibraries()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedLibrary: Library | null = selectedId ? idToLibrary.get(selectedId) ?? null : null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', height: '100vh' }}>
      <div id="map-panel" style={{ position: 'relative' }}>
        <div id="map-container" style={{ position: 'absolute', inset: 0 }} />
        <SeoulMap containerId="map-container" onLibrarySelect={setSelectedId} />
      </div>
      <div id="sidebar" style={{ padding: '16px', overflow: 'auto', borderLeft: '1px solid #e5e7eb' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>서울시 공공도서관</h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>구별 지도 + 도서관 책장형 시각화</p>
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#6b7280' }}>지도에서 도서관을 클릭하세요</span>
          </div>
          <div id="bookshelf-container" style={{ height: 360, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            {selectedLibrary ? (
              <div style={{ marginBottom: 8 }}>
                <strong>{selectedLibrary.name}</strong>
                <div style={{ color: '#6b7280', fontSize: 12 }}>{selectedLibrary.district}</div>
              </div>
            ) : (
              <div style={{ color: '#6b7280' }}>지도의 도서관을 선택하세요</div>
            )}
            <Bookshelf
              containerId="bookshelf-container"
              items={selectedLibrary?.categories ?? []}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
