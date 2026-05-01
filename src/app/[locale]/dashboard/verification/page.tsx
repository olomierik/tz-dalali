"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Upload, AlertCircle } from "lucide-react";

export default function VerificationPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Trust & Verification</h1>
        <p className="text-gray-500">Verify your identity to increase trust and unlock higher transaction limits.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            Smile ID Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">
              We use Smile ID for secure identity verification across Africa. Your data is encrypted and handled according to local regulations.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold">1</div>
              <div className="flex-1">
                <p className="font-medium">Government ID</p>
                <p className="text-sm text-gray-500">Upload a clear photo of your ID or Passport.</p>
              </div>
              <Button size="sm" variant="outline"><Upload className="h-4 w-4 mr-2" /> Upload</Button>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold">2</div>
              <div className="flex-1">
                <p className="font-medium">Liveness Check</p>
                <p className="text-sm text-gray-500">A quick selfie to confirm you are the ID holder.</p>
              </div>
              <Button size="sm" variant="outline">Start Camera</Button>
            </div>
          </div>

          <Button className="w-full bg-[#003580]" disabled>Submit for Verification</Button>
        </CardContent>
      </Card>
    </div>
  );
}
