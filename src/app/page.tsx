"use client";

import { useState, useEffect, useCallback } from "react";
import { verifyTelegramUserUtil } from "@/utils/telegramAuth"; // Import the utility
import { type TelegramUser } from "@/types/telegram";
import LandingPageUI from "@/components/LandingPage"; // Import the UI component
import { getPkpSessionSigs } from "@/utils/litProtocol/getPkpSessionSigs";
import { mintPkp } from "@/utils/litProtocol/mintPkp";
import { MintedPkp, PkpSessionSigs } from "@/types/litProtocol";

function LandingPage() {
  const NEXT_PUBLIC_TELEGRAM_BOT_NAME =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "GALT_BOT";
  const NEXT_PUBLIC_TELEGRAM_BOT_SECRET: any =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_SECRET;

  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [mintedPkp, setMintedPkp] = useState<MintedPkp | null>(null);
  const [pkpSessionSigs, setPkpSessionSigs] = useState<PkpSessionSigs | null>(
    null
  );

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

  const handleMintPkp = async () => {
    if (telegramUser) {
      try {
        const minted = await mintPkp(telegramUser);
        setMintedPkp(minted!);
      } catch (error) {
        console.error("Failed to mint PKP:", error);
        setValidationError("Failed to mint PKP. Please try again.");
      }
    }
  };

  const handleGetPkpSessionSigs = async () => {
    if (telegramUser && mintedPkp) {
      try {
        const sessionSigs = await getPkpSessionSigs(
          telegramUser,
          mintedPkp,
          NEXT_PUBLIC_TELEGRAM_BOT_SECRET
        );
        setPkpSessionSigs(sessionSigs);
      } catch (error) {
        console.error("Failed to get PKP session signatures:", error);
        setValidationError(
          "Failed to get PKP session signatures. Please try again."
        );
      }
    }
  };

  return (
    <LandingPageUI
      telegramUser={telegramUser}
      validationError={validationError}
      handleTelegramResponse={handleTelegramResponse}
      botName={NEXT_PUBLIC_TELEGRAM_BOT_NAME}
      isUserValid={!!telegramUser}
      handleMintPkp={handleMintPkp}
      handleGetPkpSessionSigs={handleGetPkpSessionSigs}
      mintedPkp={mintedPkp}
      pkpSessionSigs={pkpSessionSigs}
    />
  );
}

export default LandingPage;
