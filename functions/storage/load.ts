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
    const userId = 'default-user'
    const key = `draft:${userId}`

    const cache = caches.default
    const cacheRequest = new Request(`https://cache/${key}`)

    let cached = await cache.match(cacheRequest)
    if (cached) {
      return new Response(cached.body, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
      })
    }

    const data = await env.KV_STORAGE.get(key, 'json')

    if (!data) {
      return new Response(JSON.stringify({ content: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=60' }
    })

    await cache.put(cacheRequest, response.clone())

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: '加载失败' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

export default { onRequest }
