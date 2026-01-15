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
    const url = new URL(request.url)
    const roomId = url.searchParams.get('roomId')

    if (!roomId) {
      return new Response(JSON.stringify({ error: '缺少房间ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const contentKey = `collab:${roomId}:content`
    const usersKey = `collab:${roomId}:users`

    const content = await env.KV_STORAGE.get(contentKey)
    const collaborators = await env.KV_STORAGE.get(usersKey, 'json') || []

    return new Response(JSON.stringify({ content, collaborators }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: '同步失败' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

export default { onRequest }
