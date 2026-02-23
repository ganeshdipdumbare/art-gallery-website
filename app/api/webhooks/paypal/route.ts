import { NextRequest, NextResponse } from "next/server"
import { markPaintingsSold } from "@/lib/db"

const PAYPAL_VERIFY_URL =
  process.env.NODE_ENV === "production"
    ? "https://ipnpb.paypal.com/cgi-bin/webscr"
    : "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr"

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const verifyPayload = `cmd=_notify-validate&${rawBody}`

    const verifyRes = await fetch(PAYPAL_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Ursula-Gallery-IPN-Listener",
      },
      body: verifyPayload,
    })
    const verifyResult = await verifyRes.text()

    if (verifyResult !== "VERIFIED") {
      return new NextResponse("Invalid", { status: 400 })
    }

    const params = new URLSearchParams(rawBody)
    const paymentStatus = params.get("payment_status")
    const custom = params.get("custom")

    if (paymentStatus !== "Completed" && paymentStatus !== "Processed") {
      return new NextResponse("OK", { status: 200 })
    }

    if (!custom || custom.trim() === "") {
      return new NextResponse("OK", { status: 200 })
    }

    const paintingIds = custom.split(",").map((id) => id.trim()).filter(Boolean)
    if (paintingIds.length > 0) {
      await markPaintingsSold(paintingIds)
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("PayPal IPN error:", error)
    return new NextResponse("Error", { status: 500 })
  }
}
