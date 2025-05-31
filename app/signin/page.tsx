import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignInForm } from "@/components/signin-form"

export default async function SignInPage() {
  const user = await getSession()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SignInForm />
    </div>
  )
}
