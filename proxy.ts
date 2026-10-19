import { NextRequest, NextResponse } from "next/server";

// Layouts can't read searchParams, so pass ?v= to embed metadata as a header.
export function proxy(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.set("x-version", req.nextUrl.searchParams.get("v") ?? "");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/chuni/:type/:id", "/maimai/:type/:id"] };
