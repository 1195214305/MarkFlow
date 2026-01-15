import { useEffect, useRef } from 'react'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/tokyo-night-dark.css'
import { useEditorStore } from '../store/editorStore'

marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

export default function Preview() {
  const content = useEditorStore(state => state.content)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = marked(content) as string
    }
  }, [content])

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-10 border-b border-dark-border flex items-center px-4 bg-dark-card">
        <span className="text-sm font-medium text-dark-muted">预览</span>
      </div>
      <div
        ref={previewRef}
        className="flex-1 overflow-y-auto p-6 preview-area"
      />
    </div>
  )
}
