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
            content: '你是一个专业的内容创作助手。根据用户已有的Markdown文档内容，自然地续写下一段内容，保持风格和主题一致。只返回续写的内容，不要添加任何解释。'
          },
          {
            role: 'user',
            content: `请根据以下内容续写：\n\n${content}`
          }
        ],
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error('千问API调用失败')
    }

    const data = await response.json() as any
    const continuation = data.choices[0].message.content

    return new Response(JSON.stringify({ continuation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: '续写失败' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

export default { onRequest }
