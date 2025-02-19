import { ExternalLink } from "lucide-react";
import type { JSX } from "react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function ContactCTA(): JSX.Element {
  return (
    <Card className={cn("mt-8")}>
      <CardHeader>
        <CardTitle>Want to boost your revenue even further?</CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-4")}>
        <p className={cn("text-gray-600")}>
          Get in touch with our team to learn more about how Sovendus can help
          grow your business. Our experts will guide you through our products
          and help you maximize your revenue potential.
        </p>
        <Button
          onClick={(): void =>
            void window.open(
              "https://online.sovendus.com/kontakt/demo-tour-kontaktformular/#",
              "_blank",
            )
          }
          className={cn("w-full sm:w-auto bg-blue-50 border-blue-200")}
        >
          Request Demo Tour{" "}
          <ExternalLink className={cn("ml-2 h-4 w-4 text-blue-700")} />
        </Button>
      </CardContent>
    </Card>
  );
}

// export function UpsellCTA(): JSX.Element {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<
//     "idle" | "success" | "error"
//   >("idle");

//   const handleSubmit = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus("idle");

//     try {
//       // Replace this with your actual API endpoint
//       const response = await fetch("/api/contact-sales", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, email, message }),
//       });

//       if (response.ok) {
//         setSubmitStatus("success");
//         setName("");
//         setEmail("");
//         setMessage("");
//       } else {
//         setSubmitStatus("error");
//       }
//     } catch (error) {
//       setSubmitStatus("error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Card className="mt-8">
//       <CardHeader>
//         <CardTitle>Want to boost your revenue even further?</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="name">Name</Label>
//             <Input
//               id="name"
//               value={name}
//               onChange={(e): void => setName(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e): void => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="message">Message</Label>
//             <Textarea
//               id="message"
//               value={message}
//               onChange={(e): void => setMessage(e.target.value)}
//               required
//             />
//           </div>
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Sending..." : "Contact Sales"}
//           </Button>
//         </form>
//         {submitStatus === "success" && (
//           <Alert className="mt-4 bg-green-50 border-green-200">
//             <AlertDescription className="text-green-700">
//               Thank you for your interest! Our sales team will contact you soon.
//             </AlertDescription>
//           </Alert>
//         )}
//         {submitStatus === "error" && (
//           <Alert className="mt-4 bg-red-50 border-red-200">
//             <AlertDescription className="text-red-700">
//               An error occurred. Please try again or contact support.
//             </AlertDescription>
//           </Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
