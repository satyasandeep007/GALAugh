// app/api/health/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("API GET request is called ");

  return NextResponse.json({
    status: "ok",
    message: "Service is healthy",
  });
}
