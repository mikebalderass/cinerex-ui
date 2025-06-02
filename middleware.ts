import { NextRequest, NextResponse } from "next/server";

export default function MiddleWare(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/dashboard')){
    const token = req.cookies.get("cinerex-")?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  return NextResponse.next()
}