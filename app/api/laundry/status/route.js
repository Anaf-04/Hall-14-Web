import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://misc.cityu-sro.hk/WMStatus/WMStatus.aspx?HallNo=14",
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch laundry status." },
        { status: 502 }
      );
    }

    const machines = await response.json();
    return NextResponse.json({ machines });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch laundry status." },
      { status: 502 }
    );
  }
}
