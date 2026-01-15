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
    const { roomId } = await request.json() as { roomId: string }

    if (!roomId) {
      return new Response(JSON.stringify({ error: '缺少房间ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const userId = `user-${Math.random().toString(36).substring(2, 8)}`
    const roomKey = `collab:${roomId}:users`

    const existingUsers = await env.KV_STORAGE.get(roomKey, 'json') as string[] || []
    if (!existingUsers.includes(userId)) {
      existingUsers.push(userId)
      await env.KV_STORAGE.put(roomKey, JSON.stringify(existingUsers), {
        expirationTtl: 3600
      })
    }

    return new Response(JSON.stringify({ success: true, userId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: '加入失败' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

export default { onRequest }
