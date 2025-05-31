import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Failed to fetch services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { serviceName, serviceType, ownerName, ownerEmail, ownerPhone, description, apiUrl, apiVersion, schema } = body

    // Validate required fields
    if (!serviceName || !serviceType) {
      return NextResponse.json({ error: "Service name and type are required" }, { status: 400 })
    }

    // Validate email format if provided
    if (ownerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Generate API credentials
    const apiKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const apiSecret = `ss_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    const service = await prisma.service.create({
      data: {
        serviceName,
        serviceType,
        ownerName,
        ownerEmail,
        ownerPhone,
        description,
        apiKey,
        apiSecret,
        apiUrl,
        schema,
        apiVersion: apiVersion || "v1",
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Failed to create service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
