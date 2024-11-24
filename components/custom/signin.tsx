'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { handleLogin } from "@/lib/auth-utils"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { auth } from "@/lib/firebase"
import { useRecoilState } from "recoil"
import userAtom from "@/atoms/userAtom"

export default function LoginPage() {
  
  const { toast } = useToast()
  const router = useRouter()
  const [fbuser, setFBUser] = useRecoilState(userAtom)

  const handleGoogleLogin = async () => {
    try {
      const user = await handleLogin()
      console.log(user)
      if (user) {
        await localStorage.setItem('user', JSON.stringify(user))
        toast({
          title: "Login Successful!",
          description: "Welcome back, Creator!"
        })
        router.push("/home")
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Error Signing You In!",
        description: 'Please try again.'
      })
    }
  }

  useEffect(()=>{
    //run this to check if the user is authenticated, send him back!
    const user = localStorage.getItem("user")
    if (user)
    {
      router.push("/signin")
    }
  },[])

  return (
    <div className="h-screen w-full bg-gradient-to-br from-primary/20 to-secondary/20 relative flex items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-10 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl font-bold text-primary">Welcome Back</h2>
          <p className="text-xl text-muted-foreground">
            Unlock Your Survey Potential
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 space-y-6"
        >
          <p className="text-center text-sm text-muted-foreground">
            Your insights are waiting. Let&apos; dive in!
          </p>
          <Button
            onClick={handleGoogleLogin}
            className="w-full text-lg py-6 flex items-center justify-center space-x-2"
            variant="outline"
          >
            <FcGoogle className="w-6 h-6" />
            <span>Sign In With Google</span>
          </Button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          By signing in, you&apos;re ready to create, share, and analyze surveys with ease.
        </motion.p>
      </motion.div>

      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary/10 rounded-full"
            style={{
              width: Math.random() * 20 + 10,
              height: Math.random() * 20 + 10,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </div>
  )
}