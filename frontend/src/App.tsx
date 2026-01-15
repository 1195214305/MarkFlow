import { useEffect, useState } from 'react'
import { useEditorStore } from './store/editorStore'
import Header from './components/Header'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Toolbar from './components/Toolbar'
import SettingsModal from './components/SettingsModal'
import TemplateModal from './components/TemplateModal'
import HistoryModal from './components/HistoryModal'
import CollaborationModal from './components/CollaborationModal'

function App() {
  const loadFromEdge = useEditorStore(state => state.loadFromEdge)
  const saveToEdge = useEditorStore(state => state.saveToEdge)
  const [showPreview, setShowPreview] = useState(true)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)

  useEffect(() => {
    loadFromEdge()

    // 检查URL中的协作房间参数
    const params = new URLSearchParams(window.location.search)
    const roomId = params.get('room')
    if (roomId) {
      localStorage.setItem('collab_room_id', roomId)
      setShowCollaboration(true)
    }

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
      <Toolbar
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        onOpenTemplates={() => setShowTemplates(true)}
        onOpenHistory={() => setShowHistory(true)}
        onOpenCollaboration={() => setShowCollaboration(true)}
      />
      <div className="flex-1 flex overflow-hidden">
        {(!showPreview || window.innerWidth > 768) && <Editor />}
        {showPreview && <Preview />}
      </div>
      <SettingsModal />
      <TemplateModal isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <CollaborationModal isOpen={showCollaboration} onClose={() => setShowCollaboration(false)} />
    </div>
  )
}

export default App
