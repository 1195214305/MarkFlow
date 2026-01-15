import { create } from 'zustand'

interface EditorState {
  content: string
  apiKey: string
  isLoading: boolean
  setContent: (content: string) => void
  setApiKey: (key: string) => void
  setLoading: (loading: boolean) => void
  saveToEdge: () => Promise<void>
  loadFromEdge: () => Promise<void>
  aiOptimize: () => Promise<void>
  aiContinue: () => Promise<void>
}

export const useEditorStore = create<EditorState>((set, get) => ({
  content: '# 欢迎使用 MarkFlow\n\n这是一个基于阿里云ESA边缘计算的智能Markdown编辑器。\n\n## 核心功能\n\n- **AI智能续写**：让千问AI帮你完成内容创作\n- **实时预览**：边写边看，所见即所得\n- **边缘存储**：自动保存草稿到边缘KV\n- **模板市场**：丰富的文档模板\n\n## 快速开始\n\n1. 在右上角设置中添加你的千问API Key\n2. 开始编写你的Markdown文档\n3. 使用AI功能优化你的内容\n\n```javascript\n// 示例代码\nconst hello = "MarkFlow";\nconsole.log(hello);\n```\n\n> 提示：所有内容会自动保存到边缘存储，无需担心数据丢失。\n',
  apiKey: localStorage.getItem('qwen_api_key') || '',
  isLoading: false,

  setContent: (content) => set({ content }),

  setApiKey: (key) => {
    localStorage.setItem('qwen_api_key', key)
    set({ apiKey: key })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  saveToEdge: async () => {
    const { content } = get()
    try {
      const response = await fetch('/api/storage/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, timestamp: Date.now() })
      })
      if (!response.ok) throw new Error('保存失败')
    } catch (error) {
      console.error('保存到边缘存储失败:', error)
    }
  },

  loadFromEdge: async () => {
    try {
      const response = await fetch('/api/storage/load')
      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          set({ content: data.content })
        }
      }
    } catch (error) {
      console.error('从边缘存储加载失败:', error)
    }
  },

  aiOptimize: async () => {
    const { content, apiKey } = get()
    if (!apiKey) {
      alert('请先在设置中添加千问API Key')
      return
    }

    set({ isLoading: true })
    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, apiKey })
      })

      if (response.ok) {
        const data = await response.json()
        set({ content: data.optimized })
      } else {
        alert('AI优化失败，请检查API Key')
      }
    } catch (error) {
      console.error('AI优化失败:', error)
      alert('AI优化失败')
    } finally {
      set({ isLoading: false })
    }
  },

  aiContinue: async () => {
    const { content, apiKey } = get()
    if (!apiKey) {
      alert('请先在设置中添加千问API Key')
      return
    }

    set({ isLoading: true })
    try {
      const response = await fetch('/api/ai/continue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, apiKey })
      })

      if (response.ok) {
        const data = await response.json()
        set({ content: content + '\n\n' + data.continuation })
      } else {
        alert('AI续写失败，请检查API Key')
      }
    } catch (error) {
      console.error('AI续写失败:', error)
      alert('AI续写失败')
    } finally {
      set({ isLoading: false })
    }
  }
}))
