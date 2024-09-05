"use client";

import { useState, useEffect, useCallback } from "react";

import TelegramLoginButton from "@/components/TelegramLoginButton";
import { type TelegramUser } from "@/types/telegram";

function LandingPage() {
  const NEXT_PUBLIC_TELEGRAM_BOT_NAME =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "GALT_BOT";
  const NEXT_PUBLIC_TELEGRAM_BOT_SECRET =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_SECRET;

  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (telegramUser) {
      console.log("Current telegramUser state:", telegramUser);
    }
  }, [telegramUser]);

  const verifyTelegramUser = useCallback(
    async (
      user: TelegramUser
    ): Promise<{ isValid: boolean; isRecent: boolean }> => {
      console.log("🔄 Validating user Telegram info client side...");
      const { hash, ...otherData } = user;

      const dataCheckString = Object.entries(otherData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");

      const encoder = new TextEncoder();
      const secretKeyHash = await crypto.subtle.digest(
        "SHA-256",
        encoder.encode(NEXT_PUBLIC_TELEGRAM_BOT_SECRET)
      );
      const key = await crypto.subtle.importKey(
        "raw",
        secretKeyHash,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(dataCheckString)
      );

      const calculatedHash = Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const isValid = calculatedHash === user.hash;
      const isRecent = Date.now() / 1000 - user.auth_date < 600;

      console.log(
        `ℹ️ User Telegram data is valid: ${isValid}. User data is recent: ${isRecent}`
      );

      return { isValid, isRecent };
    },
    [NEXT_PUBLIC_TELEGRAM_BOT_SECRET]
  );

  const handleTelegramResponse = useCallback(
    async (user: TelegramUser) => {
      console.log("Telegram auth response received:", user);
      if (user && typeof user === "object") {
        setTelegramUser(user);

        const { isValid, isRecent } = await verifyTelegramUser(user);
        if (!isValid || !isRecent) {
          setValidationError(
            !isValid
              ? "Failed to validate Telegram user info. Please try again."
              : "Authentication has expired. Please log in again."
          );
        } else {
          setValidationError(null);
        }
      } else {
        console.error("Invalid user data received:", user);
        setValidationError("Invalid user data received. Please try again.");
      }
    },
    [verifyTelegramUser]
  );
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 bg-gradient-to-b from-blue-500 to-blue-300">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white">PrivAI</h1>
        <p className="mt-4 text-lg text-white">Your Privacy, Our Priority</p>
        <p className="mt-2 text-md text-gray-200">
          Experience the future of secure communication.
        </p>
      </header>
      <section className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold mb-6">Why Choose PrivAI?</h2>
        <ul className="list-disc list-inside space-y-4">
          <li className="flex items-start">
            <span className="text-2xl mr-2">🔒</span>
            <span>
              End-to-End Encryption: Your messages are secure and private.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-2xl mr-2">👤</span>
            <span>Data Minimization: We only collect the data we need.</span>
          </li>
          <li className="flex items-start">
            <span className="text-2xl mr-2">🛡️</span>
            <span>
              Anonymous Usage: Use our app without revealing your identity.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-2xl mr-2">🔍</span>
            <span>Transparency: Know how your data is used and stored.</span>
          </li>
        </ul>
      </section>
      <footer className="mt-10">
        <h4 className="text-lg text-white mb-4">
          Step 1: Authenticate with Telegram
        </h4>
        <TelegramLoginButton
          botName={NEXT_PUBLIC_TELEGRAM_BOT_NAME}
          buttonSize="large"
          dataOnauth={(user) => console.log("User authenticated:", user)} // Handle authentication response
        />
      </footer>
    </div>
  );
}

export default LandingPage;
