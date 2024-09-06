import { TelegramUser } from "@/types/telegram";

export const verifyTelegramUserUtil = async (
  user: TelegramUser,
  secret: string
) => {
  console.log("🔄 Validating user Telegram info client side...");
  const { hash, ...otherData } = user;

  const dataCheckString = Object.entries(otherData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const encoder = new TextEncoder();
  const secretKeyHash = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(secret)
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
};
