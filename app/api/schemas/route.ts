import { Schema } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

  try {
    const db = await prisma.$queryRaw`
    SELECT * FROM schema_info
  `;

    const result = {
      data: db,
      json() {
        return JSON.stringify(this.data, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value
        );
      }
    };

    return new Response(result.json(), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schemas" },
      { status: 500 })
  }
}

export async function POST(request: Request) {

  try {
    const { name } = await request.json();
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      return NextResponse.json(
        { error: "Invalid schema name" },
        { status: 400 }
      );
    }

    await prisma.$executeRawUnsafe(
      `CREATE SCHEMA IF NOT EXISTS "${name}"`
    );

    return NextResponse.json(
      { message: "Schema created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create schema" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { oldName: string } }) {
  try {
    const { oldName } = params;
    const { newName } = await request.json();


    if (!/^[a-z_][a-z0-9_]*$/.test(newName)) {
      return NextResponse.json(
        { error: "Invalid new schema name format" },
        { status: 400 }
      );
    }


    const schemaExists = await prisma.$queryRawUnsafe<Schema[]>(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      oldName
    );

    if (!schemaExists.length) {
      return NextResponse.json(
        { error: `Schema ${oldName} not found` },
        { status: 404 }
      );
    }


    await prisma.$executeRawUnsafe(
      `ALTER SCHEMA "${oldName}" RENAME TO "${newName}"`
    );

    return NextResponse.json(
      { message: `Schema renamed from ${oldName} to ${newName}` },
      { status: 200 }
    );
  } catch (error) {
    let errorMessage = "Failed to rename schema";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;

    // Typed schema existence check
    const schemaExists = await prisma.$queryRawUnsafe<Schema[]>(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      name
    );

    if (!schemaExists || schemaExists.length === 0) {
      return NextResponse.json(
        { error: `Schema ${name} not found` },
        { status: 404 }
      );
    }

    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${name}" CASCADE`
    );

    return NextResponse.json(
      { message: `Schema ${name} deleted successfully` },
      { status: 200 }
    );
  } catch (error: unknown) {
    let errorMessage = "Failed to delete schema";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}