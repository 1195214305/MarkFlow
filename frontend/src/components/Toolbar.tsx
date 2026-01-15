import { Sparkles, Wand2, Save, Download, Eye, Edit3 } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'

interface ToolbarProps {
  showPreview: boolean
  setShowPreview: (show: boolean) => void
}

export default function Toolbar({ showPreview, setShowPreview }: ToolbarProps) {
  const { isLoading, aiOptimize, aiContinue, saveToEdge, content } = useEditorStore()

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `markflow-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-12 border-b border-dark-border flex items-center justify-between px-4 md:px-6 glass-effect">
      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={aiContinue}
          disabled={isLoading}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
        >
          <Sparkles size={14} className="md:w-4 md:h-4" />
          <span className="hidden md:inline font-medium">AI续写</span>
          <span className="md:hidden">续写</span>
        </button>

        <button
          onClick={aiOptimize}
          disabled={isLoading}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
        >
          <Wand2 size={14} className="md:w-4 md:h-4" />
          <span className="hidden md:inline font-medium">AI优化</span>
          <span className="md:hidden">优化</span>
        </button>

        {/* 移动端切换按钮 */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="md:hidden flex items-center gap-1 px-2 py-1.5 hover:bg-dark-card rounded-lg transition-colors text-xs"
        >
          {showPreview ? <Edit3 size={14} /> : <Eye size={14} />}
          <span>{showPreview ? '编辑' : '预览'}</span>
        </button>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={saveToEdge}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 hover:bg-dark-card rounded-lg transition-colors text-xs md:text-sm"
        >
          <Save size={14} className="md:w-4 md:h-4" />
          <span className="hidden md:inline">保存</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 hover:bg-dark-card rounded-lg transition-colors text-xs md:text-sm"
        >
          <Download size={14} className="md:w-4 md:h-4" />
          <span className="hidden md:inline">导出</span>
        </button>
      </div>
    </div>
  )
}
