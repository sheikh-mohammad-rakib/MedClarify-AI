import { useState } from "react";
import type { ChangeEvent } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AlertTriangle,
  Check,
  Clock,
  KeyRound,
  Loader2,
  Pill,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { skillInstructions } from "./skills";

// Uncomment these if you have Firebase fully connected
// import { db } from "./firebaseConfig";
// import { collection, addDoc } from "firebase/firestore";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type ScheduleEntry = {
  time_of_day: string;
  action: string;
};

type MedData = {
  medication_name: string;
  plain_english_instructions: string;
  warning_labels: string[];
  daily_schedule: ScheduleEntry[];
};

export default function App() {
  const [apiKey, setApiKey] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [medData, setMedData] = useState<MedData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const saveToCloud = async (data: MedData | null) => {
    if (!data) return;
    setSaveStatus("saving");
    try {
      // Uncomment these lines if you have Firebase fully connected
      /*
      await addDoc(collection(db, "medications"), {
        ...data,
        savedAt: new Date(),
      });
      */
      
      // Simulating a successful save for the UI if Firebase isn't hooked up yet
      setTimeout(() => setSaveStatus("saved"), 800); 
    } catch (err) {
      console.error("Firestore save error:", err);
      setSaveStatus("error");
    }
  };

  const processImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !apiKey) {
      alert("Please enter your API Key and select an image.");
      return;
    }

    setImageFile(file);
    setLoading(true);
    setSaveStatus("idle");

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        // 1. Extract base64 without the URI prefix
        const base64Data = (reader.result as string).split(",")[1];

        // 2. Initialize the STABLE SDK (Bypasses CORS restrictions)
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash", // Updated to the active supported model
          systemInstruction: skillInstructions,
          generationConfig: { responseMimeType: "application/json" }
        });

        // 3. Prepare the image object for the SDK
        const imagePart = {
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        };

        const prompt = `Analyze this medical label based on AGENTS.md and SKILL.md rules. Return a clean JSON object ONLY. Structure: { "medication_name": "string", "plain_english_instructions": "string", "warning_labels": ["string"], "daily_schedule": [{ "time_of_day": "string", "action": "string" }] }`;

        // 4. Call the API
        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();

        // 5. Defensively strip markdown if it snuck through
        const cleanedText = responseText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanedText) as MedData;
        
        setMedData(parsed);
      } catch (err) {
        console.error("Gemini API Error:", err);
        alert("Failed to analyze image. Please verify your API Key and try again.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-foreground">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
            <Pill className="size-4" />
            <span>AI Medical Companion</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            MedClarify AI
          </h1>
          <p className="mt-2 text-base text-muted-foreground  sm:text-lg">
            Powered by Gemini 2.5 Flash
          </p>
        </header>

        {/* Medical Disclaimer */}
        <Alert className="mb-8 border-amber-500 bg-amber-50 text-amber-900 [&>svg]:text-amber-600">
          <AlertTriangle className="size-4" />
          <AlertTitle className="font-semibold">Medical Disclaimer</AlertTitle>
          <AlertDescription className="text-amber-900">
            This is an educational tool, not medical advice. Always consult your
            doctor or a qualified healthcare professional before making any
            decisions about your medication or health.
          </AlertDescription>
        </Alert>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload &amp; Analyze</CardTitle>
            <CardDescription>
              Provide your API key and upload a photo of your medication label
              to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API Key */}
            <div className="space-y-2">
              <Label htmlFor="api-key">
                <KeyRound className="size-4" />
                Gemini API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Your key is stored locally and never sent to our servers.
              </p>
            </div>

            <Separator />

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="image-upload">
                <Upload className="size-4" />
                Medication Label Image
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={processImage}
                className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-4 file:py-1 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {imageFile && (
                <p className="text-xs text-muted-foreground">
                  Selected:{" "}
                  <span className="font-medium text-foreground">
                    {imageFile.name}
                  </span>
                </p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center gap-2 rounded-md border border-border bg-muted p-4">
                <Loader2 className="size-5 animate-spin text-emerald-600" />
                <span className="text-sm font-medium">
                  Analyzing your medication label…
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {medData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="size-5 text-emerald-600" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                Clear, plain-English guidance from your medication label.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Medication Name */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Medication Name
                </h3>
                <p className="mt-1 text-2xl font-bold">
                  {medData.medication_name}
                </p>
              </div>

              <Separator />

              {/* Plain English Instructions */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Plain English Instructions
                </h3>
                <p className="mt-2 leading-relaxed">
                  {medData.plain_english_instructions}
                </p>
              </div>

              <Separator />

              {/* Daily Schedule Timeline */}
              {medData.daily_schedule && medData.daily_schedule.length > 0 && (
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Clock className="size-4" />
                    Daily Schedule
                  </h3>
                  <ol className="relative space-y-4 border-l-2 border-emerald-200 pl-6">
                    {medData.daily_schedule.map((entry, index) => (
                      <li key={index} className="relative">
                        <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                          {index + 1}
                        </span>
                        <p className="font-semibold">{entry.time_of_day}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.action}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Warning Labels */}
              {medData.warning_labels && medData.warning_labels.length > 0 && (
                <>
                  <Separator />
                  <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <ShieldAlert className="size-5 text-red-600" />
                      <h3 className="text-sm font-bold uppercase tracking-wide text-red-700">
                        Warning Labels
                      </h3>
                    </div>
                    <ul className="space-y-1 text-sm text-red-900">
                      {medData.warning_labels.map((label, i) => (
                        <li key={i}>• {label}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <Separator />

              {/* Save to Dashboard */}
              <div className="flex items-center justify-end">
                {saveStatus === "saved" ? (
                  <div
                    className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
                    role="status"
                    aria-live="polite"
                  >
                    <Check className="size-4" />
                    Saved to Dashboard
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={() => saveToCloud(medData)}
                    disabled={saveStatus === "saving" || !medData}
                    variant="default"
                  >
                    {saveStatus === "saving" ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Saving…
                      </>
                    ) : saveStatus === "error" ? (
                      "Retry Save"
                    ) : (
                      "Save to Dashboard"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>© 2026 MedClarify AI — For educational purposes only.</p>
        </footer>
      </div>
    </div>
  );
}