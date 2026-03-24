import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { email, readinessTier, runway, archetype } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const entry = {
      email: email.trim().toLowerCase(),
      readinessTier: readinessTier || null,
      runway: runway || null,
      archetype: archetype || null,
      capturedAt: new Date().toISOString(),
    };

    // Append to a local JSON-lines file as a simple stub.
    // Replace this with Resend, ConvertKit, or any email service later.
    const filePath = path.join(process.cwd(), "captured-emails.jsonl");
    await fs.appendFile(filePath, JSON.stringify(entry) + "\n", "utf-8");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
