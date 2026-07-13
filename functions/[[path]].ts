export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (url.pathname === '/index.html') {
    return await env.ASSETS.fetch(request);
  }

  if (url.pathname.startsWith('/assets/') || url.pathname === '/vite.svg') {
    return await env.ASSETS.fetch(request);
  }

  return await env.ASSETS.fetch(new Request('http://localhost/index.html', request));
}
