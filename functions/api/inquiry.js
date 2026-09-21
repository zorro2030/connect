export async function onRequestPost(context) {
  try {
    // 1. 获取前端 POST 提交的数据
    const data = await context.request.json();

    // 2. 在这里编写写入数据库的逻辑
    // 例如：连接 Cloudflare D1 数据库、KV，或 Fetch 请求外部数据库 API
    // console.log("收到表单数据:", data);

    // 3. 返回成功响应给前端
    return new Response(JSON.stringify({ success: true, message: "提交成功" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
