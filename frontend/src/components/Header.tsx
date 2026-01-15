import { Settings, Github } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <header className="h-14 border-b border-dark-border flex items-center justify-between px-6 glass-effect">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">MarkFlow</h1>
            <p className="text-xs text-dark-muted">智能Markdown工作流</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/1195214305/MarkFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-muted hover:text-white transition-colors"
          >
            <Github size={20} />
          </a>
          <button
            onClick={() => setShowSettings(true)}
            className="text-dark-muted hover:text-white transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-effect rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">设置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">千问API Key</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  onChange={(e) => {
                    localStorage.setItem('qwen_api_key', e.target.value)
                  }}
                  defaultValue={localStorage.getItem('qwen_api_key') || ''}
                />
                <p className="text-xs text-dark-muted mt-2">
                  在<a href="https://dashscope.console.aliyun.com/" target="_blank" className="text-primary hover:underline">阿里云百炼</a>获取API Key
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg transition-colors"
            >
              保存设置
            </button>
          </div>
        </div>
      )}
    </>
  )
}
