"use client"

import { useState } from "react"
import { auth } from "@/lib/firebase"
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword 
} from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function PasswordForm() {
  const [user] = useAuthState(auth)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email) return

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
      })
      return
    }

    if (formData.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
      })
      return
    }

    setLoading(true)
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      )
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, formData.newPassword)
      
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      })
    } catch (error: any) {
      let errorMessage = "Failed to update password. Please try again."
      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect."
      }
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}