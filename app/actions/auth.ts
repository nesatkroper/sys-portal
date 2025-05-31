"use server"

import  prisma  from "@/lib/prisma"
import { hashPassword, verifyPassword, createSession, destroySession } from "@/lib/auth"
import { signInSchema, signUpSchema } from "@/lib/validations"
import { redirect } from "next/navigation"
import { User } from "@/lib/generated/prisma"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const result = signInSchema.safeParse({ email, password })

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: "Invalid email or password" }
    }

    if (user.status !== "active") {
      return { error: "Account is not active" }
    }

    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return { error: "Invalid email or password" }
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date().toISOString() },
    })

    await createSession(user.id)
  } catch (error) {
    return { error: "Something went wrong. Please try again." }
  }

  redirect("/dashboard")
}

export async function signUp(formData: FormData) {
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string

  const result = signUpSchema.safeParse({ username, email, password, role })

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role as any,
        permissions: role === "admin" ? ["read", "write", "delete", "manage_users"] : ["read"],
      },
    })

    await createSession(user.id)
  } catch (error) {
    return { error: "Something went wrong. Please try again." }
  }

  redirect("/dashboard")
}

export async function signOut() {
  await destroySession()
  redirect("/signin")
}
