import { useState, useEffect } from 'react'
import { X, Clock, RotateCcw } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

interface HistoryItem {
  timestamp: number
  content: string
  preview: string
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const setContent = useEditorStore(state => state.setContent)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadHistory()
    }
  }, [isOpen])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/storage/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history || [])
      }
    } catch (error) {
      console.error('加载历史版本失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = (content: string) => {
    if (confirm('确定要恢复到这个版本吗？当前内容将被替换。')) {
      setContent(content)
      onClose()
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`

    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-effect rounded-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div>
            <h2 className="text-2xl font-bold">历史版本</h2>
            <p className="text-sm text-dark-muted mt-1">查看和恢复历史保存的版本</p>
          </div>
          <button
            onClick={onClose}
            className="text-dark-muted hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 历史列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center text-dark-muted py-12">
              加载中...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center text-dark-muted py-12">
              <Clock size={48} className="mx-auto mb-4 opacity-50" />
              <p>暂无历史版本</p>
              <p className="text-sm mt-2">编辑内容后会自动保存历史版本</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <div
                  key={item.timestamp}
                  className="glass-effect p-4 rounded-lg hover:border-primary transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-dark-muted flex-shrink-0" />
                        <span className="text-sm text-dark-muted">
                          {formatTime(item.timestamp)}
                        </span>
                        {index === 0 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                            最新
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-dark-text line-clamp-3 font-mono">
                        {item.preview}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRestore(item.content)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex-shrink-0"
                    >
                      <RotateCcw size={14} />
                      <span className="text-sm">恢复</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
