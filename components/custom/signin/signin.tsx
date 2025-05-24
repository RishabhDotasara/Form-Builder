'use client'

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { handleLogin } from "@/lib/auth-utils"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { useRecoilState } from "recoil"
import userAtom from "@/atoms/userAtom"
import { storeUser } from "@/lib/firestore-utils"

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [fbuser, setFBUser] = useRecoilState(userAtom)

  const handleGoogleLogin = async () => {
    try {
      const user = await handleLogin()
      if (user) {
        await storeUser(user)
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

  return (
    <div className="h-screen w-full bg-gradient-to-br from-primary/20 to-secondary/20 relative flex items-center justify-center overflow-hidden">
      {/* Animated background particles */}
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

      {/* Login card */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="relative z-10 w-full max-w-md p-10 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/10"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-primary">Welcome Back</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary/60 to-secondary/60 mx-auto mt-2 rounded-full" />
          </motion.div>
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
            Your insights are waiting. Let&apos;s dive in!
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleGoogleLogin}
              className="w-full text-lg py-6 flex items-center justify-center space-x-2 group transition-all duration-300 bg-background hover:bg-background/90"
              variant="outline"
            >
              <FcGoogle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="group-hover:translate-x-1 transition-transform duration-300">Sign In With Google</span>
            </Button>
          </motion.div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          By signing in, you&apos;re ready to create, share, and analyze surveys with ease.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-secondary/30 via-primary/30 to-secondary/30 rounded-full"
        />
      </motion.div>
    </div>
  )
}