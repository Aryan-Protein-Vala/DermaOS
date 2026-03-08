"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const authSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
})

type AuthFormData = z.infer<typeof authSchema>

interface LoginDialogProps {
    children?: React.ReactNode
}

export function LoginDialog({ children }: LoginDialogProps) {
    const router = useRouter()
    const { update } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
    })

    const onSubmit = async (data: AuthFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            if (isSignUp) {
                // Register new user
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.error || "Failed to create account")
                }
            }

            // Sign in
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                throw new Error("Invalid email or password")
            }

            setIsOpen(false)
            reset()
            // Force session update and page refresh
            await update()
            router.refresh()
            window.location.reload()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/" })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button
                        variant="outline"
                        className="font-mono text-sm border-foreground rounded-none bg-transparent"
                    >
                        Login
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white border-[#E5E5E5]">
                <DialogHeader>
                    <DialogTitle className="font-mono text-xl text-center">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Google Sign In */}
                    <Button
                        variant="outline"
                        className="w-full font-mono text-sm border-[#E5E5E5] rounded-none bg-transparent h-12"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[#E5E5E5]" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-2 text-muted-foreground font-mono">or</span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 text-sm font-mono">
                                {error}
                            </div>
                        )}

                        {isSignUp && (
                            <div className="space-y-2">
                                <Label htmlFor="name" className="font-mono text-sm">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    placeholder="Your name"
                                    className="font-mono border-[#E5E5E5] rounded-none"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs font-mono">{errors.name.message}</p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-mono text-sm">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="you@example.com"
                                className="font-mono border-[#E5E5E5] rounded-none"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs font-mono">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-mono text-sm">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                placeholder="••••••••"
                                className="font-mono border-[#E5E5E5] rounded-none"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs font-mono">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-mono text-sm bg-foreground text-background hover:bg-foreground/90 rounded-none h-12"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-center font-mono text-sm text-muted-foreground">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp)
                                setError(null)
                            }}
                            className="text-foreground underline hover:no-underline"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
