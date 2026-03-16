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
    <nav className='p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all
    duration-200 border-b border-transparent'>
        <div className='container mx-auto flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <Image src="/logo.svg" alt="Logo" width={50} height={50} className='dark:invert'/>
            </div>
            <div className='flex items-center gap-2'>
                <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                    {theme === "light" ? (
                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    ) : (
                        <Moon className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    )}
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