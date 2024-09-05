"use client";

import { useState, useEffect, useCallback } from "react";

import TelegramLoginButton from "@/components/TelegramLoginButton";
import { type TelegramUser } from "@/types/telegram";

function App() {
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
    <div className="flex flex-col items-center justify-center h-screen text-gray-800">
      <div className="card">
        <h4>Step 1: Authenticate with Telegram</h4>
        {!telegramUser ? (
          <TelegramLoginButton
            botName={NEXT_PUBLIC_TELEGRAM_BOT_NAME}
            dataOnauth={handleTelegramResponse}
            buttonSize="large"
          />
        ) : (
          <div>
            <p>Authenticated as:</p>
            <pre>{JSON.stringify(telegramUser, null, 2)}</pre>
          </div>
        )}
        {validationError && (
          <div className="error-message">
            <p>{validationError}</p>
          </div>
        )}
        <hr />
      </div>
    </div>
  );
}

export default App;
