function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export async function onRequest(context) {
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
    const { content, apiKey } = await request.json()

    if (!apiKey) {
      return new Response(JSON.stringify({ error: '缺少API Key' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const cacheKey = `ai-optimize-${hashString(content)}`
    const cache = caches.default
    const cacheRequest = new Request(`https://cache/${cacheKey}`)

    let cached = await cache.match(cacheRequest)
    if (cached) {
      return new Response(cached.body, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
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
            content: '你是一个专业的Markdown文档优化助手。你的任务是优化用户提供的Markdown文档，改进语法、结构、可读性，但保持原意不变。只返回优化后的Markdown内容，不要添加任何解释。'
          },
          {
            role: 'user',
            content: `请优化以下Markdown文档：\n\n${content}`
          }
        ],
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error('千问API调用失败')
    }

    const data = await response.json()
    const optimized = data.choices[0].message.content

    const result = JSON.stringify({ optimized })
    const resultResponse = new Response(result, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=3600' }
    })

    await cache.put(cacheRequest, resultResponse.clone())

    return new Response(result, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: '优化失败' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

export default { onRequest }
