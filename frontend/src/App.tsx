import { useEffect, useState } from 'react'
import { useEditorStore } from './store/editorStore'
import Header from './components/Header'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Toolbar from './components/Toolbar'
import SettingsModal from './components/SettingsModal'

function App() {
  const loadFromEdge = useEditorStore(state => state.loadFromEdge)
  const saveToEdge = useEditorStore(state => state.saveToEdge)
  const [showPreview, setShowPreview] = useState(true)

  useEffect(() => {
    loadFromEdge()

    const interval = setInterval(() => {
      saveToEdge()
    }, 30000)

    const handleResize = () => {
      setShowPreview(window.innerWidth > 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [loadFromEdge, saveToEdge])

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <Header />
      <Toolbar showPreview={showPreview} setShowPreview={setShowPreview} />
      <div className="flex-1 flex overflow-hidden">
        {(!showPreview || window.innerWidth > 768) && <Editor />}
        {showPreview && <Preview />}
      </div>
      <SettingsModal />
    </div>
  )
}

export default App
