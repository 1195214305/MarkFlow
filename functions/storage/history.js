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
    const userId = 'default-user'
    const prefix = `history:${userId}:`

    const list = await env.KV_STORAGE.list({ prefix })

    const history = await Promise.all(
      list.keys.slice(0, 20).map(async (key) => {
        const content = await env.KV_STORAGE.get(key.name)
        const timestamp = parseInt(key.name.split(':')[2])
        const preview = content ? content.substring(0, 200) : ''

        return {
          timestamp,
          content,
          preview
        }
      })
    )

    history.sort((a, b) => b.timestamp - a.timestamp)

    return new Response(JSON.stringify({ history }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: '加载历史失败' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

export default { onRequest }
