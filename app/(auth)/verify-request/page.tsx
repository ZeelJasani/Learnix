// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
// import { authClient } from "@/lib/auth-client";
// import { Loader2 } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useTransition } from "react";
// import { toast } from "sonner";

// export default function VerifyRequest() {
//     const router = useRouter()
//     const [otp, setOtp] = useState("");
//     const [emailPending, startTransition] = useTransition();
//     const params = useSearchParams()
//     const email = params.get('email') as string
//     const isOtpCompleted = otp.length === 6;
//     function verifyOtp() {
//         startTransition(async () => {
//             await authClient.signIn.emailOtp({
//                 email: email,
//                 otp: otp,
//                 fetchOptions: {
//                     onSuccess: () => {
//                         toast.success('Email verified')
//                         router.push("/")
//                     },
//                     onError: () => {
//                         toast.error("error verifying Email/OTP")
//                     }
//                 }
//             })
//         })
//     }
//     return (
//         <Card className="w-full mx-auto bg-neutral-900 text-white p-6 rounded-xl">
//             <CardHeader className="text-center space-y-2">
//                 <CardTitle className="text-xl font-semibold">Please check your email</CardTitle>
//                 <CardDescription className="text-gray-400">
//                     We have sent a verification email code to your email address:
//                     <br />
//                     <span className="font-medium text-white">{email}</span>
//                     <br />
//                     Please open the email and paste the code below.
//                 </CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-6">
//                 <div className="flex flex-col items-center space-y-4">
//                     <InputOTP
//                         value={otp}
//                         onChange={(value) => setOtp(value)}
//                         maxLength={6}
//                         className="gap-3"
//                     >
//                         <InputOTPGroup>
//                             <InputOTPSlot index={0} />
//                             <InputOTPSlot index={1} />
//                             <InputOTPSlot index={2} />
//                             <InputOTPSlot index={3} />
//                             <InputOTPSlot index={4} />
//                             <InputOTPSlot index={5} />
//                         </InputOTPGroup>
//                     </InputOTP>
//                     <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your email</p>
//                 </div>

//                 <Button
//                     onClick={verifyOtp}
//                     disabled={emailPending || !isOtpCompleted}
//                     className="w-full">
//                     {emailPending ? (
//                         <>
//                             <Loader2 className="size-4 animate-spin" />
//                             <span>Loading...</span>
//                         </>
//                     ) : (
//                         "verify Account"
//                     )}
//                     {/* Verify Account */}
//                 </Button>
//             </CardContent>
//         </Card>
//     );
// }







"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, Suspense } from "react";
import { toast } from "sonner";

function VerifyRequestContent() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [emailPending, startTransition] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const isOtpCompleted = otp.length === 6;

  function verifyOtp() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified");
            router.push("/");
          },
          onError: () => {
            toast.error("Error verifying Email/OTP");
          },
        },
      });
    });
  }

  return (
    <Card className="w-full max-w-sm mx-auto bg-neutral-900 text-white p-4 rounded-xl shadow-md">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-lg font-semibold">Please check your email</CardTitle>
        <CardDescription className="text-gray-400 text-sm">
          We have sent a verification code to:
          <div className="mt-1 text-sm font-medium text-white bg-neutral-800 px-2 py-1 rounded">
            {email}
          </div>
          <p className="mt-2">Enter the code below:</p>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={6}
            className="gap-2 scale-90"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-xs text-gray-400">6-digit code from your email</p>
        </div>

        <Button
          onClick={verifyOtp}
          disabled={emailPending || !isOtpCompleted}
          className="w-full h-9 text-sm font-medium bg-primary hover:bg-primary/90 transition-all"
        >
          {emailPending ? (
            <>
              <Loader2 className="size-3 animate-spin mr-1" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function VerifyRequest() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center p-8"><Loader2 className="size-4 animate-spin" /></div>}>
      <VerifyRequestContent />
    </Suspense>
  );
}
