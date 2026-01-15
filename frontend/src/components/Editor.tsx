import { useEditorStore } from '../store/editorStore'

export default function Editor() {
  const { content, setContent } = useEditorStore()

  return (
    <div className="flex-1 flex flex-col border-r border-dark-border">
      <div className="h-10 border-b border-dark-border flex items-center px-4 bg-dark-card">
        <span className="text-sm font-medium text-dark-muted">编辑器</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 bg-dark-bg text-dark-text p-6 editor-area resize-none focus:outline-none"
        placeholder="开始编写你的Markdown文档..."
        spellCheck={false}
      />
    </div>
  )
}
