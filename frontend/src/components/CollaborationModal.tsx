import { useState, useEffect } from 'react'
import { X, Users, Copy, Check, RefreshCw } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'

interface CollaborationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CollaborationModal({ isOpen, onClose }: CollaborationModalProps) {
  const { content, setContent } = useEditorStore()
  const [roomId, setRoomId] = useState('')
  const [copied, setCopied] = useState(false)
  const [collaborators, setCollaborators] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (isOpen && !roomId) {
      const savedRoomId = localStorage.getItem('collab_room_id')
      if (savedRoomId) {
        setRoomId(savedRoomId)
      }
    }
  }, [isOpen])

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10)
    setRoomId(newRoomId)
    localStorage.setItem('collab_room_id', newRoomId)
    joinRoom(newRoomId)
  }

  const joinRoom = async (id: string) => {
    try {
      const response = await fetch('/api/collab/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: id })
      })

      if (response.ok) {
        setIsConnected(true)
        startSync(id)
      }
    } catch (error) {
      console.error('加入协作失败:', error)
    }
  }

  const startSync = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/collab/sync?roomId=${id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.content && data.content !== content) {
            setContent(data.content)
          }
          setCollaborators(data.collaborators || [])
        }
      } catch (error) {
        console.error('同步失败:', error)
      }
    }, 3000)

    return () => clearInterval(interval)
  }

  const copyRoomLink = () => {
    const link = `${window.location.origin}?room=${roomId}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const leaveRoom = () => {
    setIsConnected(false)
    setRoomId('')
    localStorage.removeItem('collab_room_id')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-effect rounded-xl max-w-md w-full">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div>
            <h2 className="text-2xl font-bold">实时协作</h2>
            <p className="text-sm text-dark-muted mt-1">多人同时编辑文档</p>
          </div>
          <button
            onClick={onClose}
            className="text-dark-muted hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-4">
          {!isConnected ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">协作房间ID</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="输入房间ID或创建新房间"
                    className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  />
                  {roomId && (
                    <button
                      onClick={() => joinRoom(roomId)}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                    >
                      加入
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={createRoom}
                className="w-full py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg transition-colors font-medium"
              >
                创建新房间
              </button>

              <div className="text-xs text-dark-muted space-y-1">
                <p>💡 提示：</p>
                <p>• 创建房间后分享链接给协作者</p>
                <p>• 所有人的编辑会实时同步</p>
                <p>• 基于边缘KV存储，全球低延迟</p>
              </div>
            </>
          ) : (
            <>
              <div className="glass-effect p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium">已连接</span>
                  </div>
                  <button
                    onClick={leaveRoom}
                    className="text-xs text-dark-muted hover:text-white transition-colors"
                  >
                    离开房间
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-muted">房间ID:</span>
                    <code className="text-sm font-mono text-primary">{roomId}</code>
                  </div>

                  <button
                    onClick={copyRoomLink}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-dark-bg hover:bg-dark-border rounded-lg transition-colors text-sm"
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="text-green-500" />
                        <span>已复制链接</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>复制协作链接</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-dark-muted" />
                  <span className="text-sm font-medium">
                    协作者 ({collaborators.length})
                  </span>
                </div>

                {collaborators.length === 0 ? (
                  <p className="text-sm text-dark-muted text-center py-4">
                    等待其他人加入...
                  </p>
                ) : (
                  <div className="space-y-2">
                    {collaborators.map((collab, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-dark-bg rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {collab.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm">{collab}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-dark-muted">
                <p>✨ 实时同步中...</p>
                <p>所有编辑会自动同步到协作者</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
