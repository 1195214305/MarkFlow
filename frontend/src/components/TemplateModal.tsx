import { useState } from 'react'
import { X, Code2, FileCode, User, Github, FileText, BookOpen } from 'lucide-react'
import { templates } from '../utils/templates'
import { useEditorStore } from '../store/editorStore'

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
}

const iconMap: Record<string, any> = {
  Code2,
  FileCode,
  User,
  Github,
  FileText,
  BookOpen
}

export default function TemplateModal({ isOpen, onClose }: TemplateModalProps) {
  const setContent = useEditorStore(state => state.setContent)
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')

  if (!isOpen) return null

  const categories = ['全部', ...Array.from(new Set(templates.map(t => t.category)))]
  const filteredTemplates = selectedCategory === '全部'
    ? templates
    : templates.filter(t => t.category === selectedCategory)

  const handleSelectTemplate = (content: string) => {
    setContent(content)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-effect rounded-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div>
            <h2 className="text-2xl font-bold">模板市场</h2>
            <p className="text-sm text-dark-muted mt-1">选择一个模板快速开始创作</p>
          </div>
          <button
            onClick={onClose}
            className="text-dark-muted hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 分类标签 */}
        <div className="flex gap-2 px-6 py-4 border-b border-dark-border overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-dark-card text-dark-muted hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 模板列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => {
              const Icon = iconMap[template.icon]
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.content)}
                  className="glass-effect p-4 rounded-lg text-left hover:border-primary transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-xs text-dark-muted mt-1 line-clamp-2">
                        {template.description}
                      </p>
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-dark-card text-dark-muted">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
