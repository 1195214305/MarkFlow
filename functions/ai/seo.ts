interface Env {
  KV_STORAGE: KVNamespace
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, apiKey } = await request.json() as { content: string; apiKey: string }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: '缺少API Key' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个SEO专家。根据用户提供的Markdown文档内容，生成优化的SEO meta标签。返回JSON格式：{"title": "标题", "description": "描述", "keywords": "关键词1,关键词2,关键词3"}'
          },
          {
            role: 'user',
            content: `请为以下内容生成SEO meta标签：\n\n${content.substring(0, 1000)}`
          }
        ],
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error('千问API调用失败')
    }

    const data = await response.json() as any
    const seoText = data.choices[0].message.content

    let seo
    try {
      seo = JSON.parse(seoText)
    } catch {
      seo = {
        title: '未命名文档',
        description: '使用MarkFlow创建的Markdown文档',
        keywords: 'markdown,文档,编辑器'
      }
    }

    return new Response(JSON.stringify({ seo }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: 'SEO生成失败' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

export default { onRequest }
