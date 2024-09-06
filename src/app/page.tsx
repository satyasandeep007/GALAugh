"use client";

import { useState, useEffect, useCallback } from "react";
import { verifyTelegramUserUtil } from "@/utils/telegramAuth"; // Import the utility
import { type TelegramUser } from "@/types/telegram";
import LandingPageUI from "@/components/LandingPage"; // Import the UI component

function LandingPage() {
  const NEXT_PUBLIC_TELEGRAM_BOT_NAME =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "GALT_BOT";
  const NEXT_PUBLIC_TELEGRAM_BOT_SECRET: any =
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
      user: TelegramUser,
      secret: string
    ): Promise<{ isValid: boolean; isRecent: boolean }> => {
      return await verifyTelegramUserUtil(user, secret);
    },
    []
  );

  const handleTelegramResponse = useCallback(
    async (user: TelegramUser) => {
      console.log("Telegram auth response received:", user);
      if (user && typeof user === "object") {
        setTelegramUser(user);

        const { isValid, isRecent } = await verifyTelegramUser(
          user,
          NEXT_PUBLIC_TELEGRAM_BOT_SECRET
        );
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
    [NEXT_PUBLIC_TELEGRAM_BOT_SECRET]
  );

  return (
    <LandingPageUI
      telegramUser={telegramUser}
      validationError={validationError}
      handleTelegramResponse={handleTelegramResponse}
      botName={NEXT_PUBLIC_TELEGRAM_BOT_NAME}
    />
  );
}

export default LandingPage;
