import * as z from "zod";

export const supportFormSchema = z.object({
  type: z.literal("support"),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().min(1, {
    message: "Company name is required.",
  }),
  submissionType: z.enum(["Feedback", "Issue", ""]).optional().default(""),
  message: z.string().min(1, {
    message: "Please provide some details.",
  }),
});

export const demoFormSchema = z.object({
  type: z.literal("demo"),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().min(1, {
    message: "Company name is required.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .default(""),
  phone: z.string().min(1, {
    message: "Phone number is required.",
  }),
  targetMarket: z.string().optional().default(""),
  communicationLanguage: z.string().optional().default(""),
  interests: z.array(z.string()).optional().default([]),
  message: z.string().min(1, {
    message: "Please provide some details.",
  }),
});

export type SupportFormValues = z.infer<typeof supportFormSchema>;
export type DemoFormValues = z.infer<typeof demoFormSchema>;

export type ContactFormType = SupportFormValues | DemoFormValues;

export enum ContactFormStatus {
  SUPPORT = "support",
  DEMO = "demo",
}
