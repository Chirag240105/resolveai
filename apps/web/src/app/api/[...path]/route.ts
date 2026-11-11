import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function proxyRequest(request: NextRequest, pathParams: { path: string[] }) {
  const backendBase =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'production' || process.env.BUILD_STANDALONE === '1'
      ? 'http://api:4000'
      : 'http://localhost:4000');

  const path = pathParams.path ? pathParams.path.join('/') : '';
  const search = request.nextUrl.search;
  const targetUrl = `${backendBase.replace(/\/$/, '')}/api/${path}${search}`;

  const headers = new Headers();
  request.headers.forEach((val, key) => {
    const lowerKey = key.toLowerCase();
    if (!['host', 'connection', 'content-length', 'expect'].includes(lowerKey)) {
      headers.set(key, val);
    }
  });

  const method = request.method;
  let body: BodyInit | null = null;
  if (!['GET', 'HEAD'].includes(method)) {
    body = await request.arrayBuffer();
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: 'manual',
    });

    const resHeaders = new Headers();
    upstreamRes.headers.forEach((val, key) => {
      resHeaders.set(key, val);
    });

    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: resHeaders,
    });
  } catch (err) {
    console.error(`[API Proxy] Failed to reach backend at ${targetUrl}:`, err);
    return NextResponse.json(
      {
        error: {
          code: 'PROXY_BACKEND_UNAVAILABLE',
          message: `Unable to connect to ResolveAI backend API at ${backendBase}. Verify the API service is running on port 4000.`,
        },
      },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const params = await ctx.params;
  return proxyRequest(req, params);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const params = await ctx.params;
  return proxyRequest(req, params);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const params = await ctx.params;
  return proxyRequest(req, params);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const params = await ctx.params;
  return proxyRequest(req, params);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const params = await ctx.params;
  return proxyRequest(req, params);
}

