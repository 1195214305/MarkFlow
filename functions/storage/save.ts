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
    const { content, timestamp } = await request.json() as { content: string; timestamp: number }

    const userId = 'default-user'
    const key = `draft:${userId}`

    await env.KV_STORAGE.put(key, JSON.stringify({
      content,
      timestamp,
      savedAt: Date.now()
    }), {
      expirationTtl: 86400 * 7
    })

    const historyKey = `history:${userId}:${timestamp}`
    await env.KV_STORAGE.put(historyKey, content, {
      expirationTtl: 86400 * 30
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: '保存失败' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

export default { onRequest }
