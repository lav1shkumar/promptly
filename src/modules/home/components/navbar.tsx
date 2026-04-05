"use client"

import React from 'react'
import Image from 'next/image'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { UserButton, Show, SignInButton, SignUpButton } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  return (
    <nav className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all border-b border-transparent duration-200">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Logo" width={50} height={50} className="dark:invert"/>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <Show when="signed-in">
                  <UserButton />
                </Show>
                <Show when="signed-out">
                  <SignInButton>
                    <Button variant="outline">Sign In</Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button>Sign Up</Button>
                  </SignUpButton>
                </Show>
            </div>
        </div>
    </nav>
  )
}

export default Navbar