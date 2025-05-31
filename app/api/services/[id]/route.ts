import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const service = await prisma.service.findUnique({
      where: { serviceId: id },
    })

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Failed to fetch service:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate email format if provided
    if (body.ownerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.ownerEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const service = await prisma.service.update({
      where: { serviceId: id },
      data: body,
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error("Failed to update service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await prisma.service.delete({
      where: { serviceId: id },
    })

    return NextResponse.json({ message: "Service deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
