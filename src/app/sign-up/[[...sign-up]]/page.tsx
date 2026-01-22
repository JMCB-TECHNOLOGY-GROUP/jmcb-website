import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
            headerTitle: "text-gray-900 font-heading",
            headerSubtitle: "text-gray-500",
            socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
            formButtonPrimary: "bg-accent hover:bg-amber-600",
            footerActionLink: "text-accent hover:text-amber-600",
          },
        }}
      />
    </div>
  );
}
