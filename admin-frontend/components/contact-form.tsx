import type { JSX } from "react";
import React, { useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function ContactForm(): JSX.Element {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Here you would typically send the email using an API endpoint
    console.log("Email sent:", { email, message });
    alert("Your message has been sent to the Sovendus representative.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
          required
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e): void => setMessage(e.target.value)}
          required
          className="mt-1 block w-full"
          rows={4}
        />
      </div>
      <Button type="submit" className="mt-2">
        Send
      </Button>
    </form>
  );
}
