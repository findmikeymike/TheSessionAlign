import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GoogleLogin } from "@react-oauth/google";
import { Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name first",
        variant: "destructive",
      });
      return;
    }

    // In production, send token and name to your backend
    console.log("Google response:", credentialResponse);
    console.log("Name:", name);

    toast({
      title: "Request Sent",
      description: "Your request has been sent to the publisher for approval",
    });
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showVerification) {
      setShowVerification(true);
    } else {
      console.log("Verifying code:", verificationCode);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-t from-[#161414] via-[#1c1e1d] via-70% to-[#58742e]/5 to-90%">
      <Card className="w-[400px] p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Welcome to SessionAlign</h2>
          <p className="text-muted-foreground">
            Sign in to start scheduling sessions
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast({
                  title: "Error",
                  description: "Login failed. Please try again.",
                  variant: "destructive",
                });
              }}
              useOneTap
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          {!showVerification ? (
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Button type="submit" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Send Code
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Button type="submit" className="w-full">
                Verify Code
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
