import React, { useEffect, useRef, useCallback } from "react";

import { type TelegramUser } from "@/types/telegram";

interface TelegramLoginButtonProps {
  botName: string;
  dataOnauth: (user: TelegramUser) => void;
  buttonSize?: "large" | "medium" | "small";
  requestAccess?: "write" | "read";
}

declare global {
  interface Window {
    TelegramLoginCallback?: (user: TelegramUser) => void;
  }
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  botName,
  dataOnauth,
  buttonSize = "large",
  requestAccess = "write",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAuth = useCallback(
    (user: TelegramUser) => {
      console.log("Telegram user:", user);
      dataOnauth(user);
    },
    [dataOnauth]
  );

  useEffect(() => {
    window.TelegramLoginCallback = handleAuth;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", buttonSize);
    script.setAttribute("data-request-access", requestAccess);
    
    // Create a URL for the mini app that will handle the OAuth flow
    const miniAppUrl = new URL(`https://t.me/${botName}/app`);
    miniAppUrl.searchParams.append("startapp", "start_oauth");
    miniAppUrl.searchParams.append("return_to", window.location.href);

    script.setAttribute("data-auth-url", miniAppUrl.toString());

    containerRef.current?.appendChild(script);

    return () => {
      containerRef.current?.removeChild(script);
      // delete window.TelegramLoginCallback;
    };
  }, [botName, handleAuth, buttonSize, requestAccess]);

  return <div ref={containerRef}></div>;
};

export default TelegramLoginButton;
