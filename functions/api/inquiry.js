export async function onRequestPost(context) {
  try {
    // 1. 获取前端发来的 JSON 请求体
    const { request, env } = context;
    const body = await request.json();

    const { name, email, phone, company, message } = body;

    // 2. 基础数据校验
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. 必须使用 await 执行 SQL 写入 D1
    // 注意：假设你在 Cloudflare 后台设置的 D1 变量名叫 DB
    const info = await env.DB.prepare(
      `INSERT INTO inquiries (name, email, phone, company, message) VALUES (?, ?, ?, ?, ?)`
    )
    .bind(name, email, phone || '', company || '', message)
    .run();

    // 4. 确认写入成功后，返回带 ok: true 的响应给前端
    if (info.success) {
      return new Response(
        JSON.stringify({ ok: true, reference: info.meta.last_row_id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error("D1 execution failed");
    }

  } catch (err) {
    // 捕获异常并给前端返回错误提示，避免前端误判为成功
    return new Response(
      JSON.stringify({ ok: false, message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
