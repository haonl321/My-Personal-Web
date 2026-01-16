import { SignIn } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
          Failure Counter
        </h1>
        <p className="text-muted-foreground text-lg">
          "From failure, you learn."
        </p>
      </div>

      <div className="glass p-1 rounded-2xl shadow-2xl border-white/20">
        <SignIn 
          path="/login"
          appearance={{
            layout: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
            elements: {
              card: "bg-transparent shadow-none border-none",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-card hover:bg-muted border-border text-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              footerActionLink: "text-primary hover:text-primary/90",
              footerBranding: "hidden", 
              footer: "[&>.cl-internal-phfxlr]:hidden" // Fallback: try to hide the branding container via CSS selector if key fails
            }
          }}
        />
      </div>
    </div>
  );
}
