import { useSearchParams } from "next/navigation";
import TelegramLoginButton from "@/components/TelegramLoginButton";

const LandingPageUI = ({
  telegramUser,
  validationError,
  handleTelegramResponse,
  botName,
  isUserValid,
  handleMintPkp,
  handleGetPkpSessionSigs,
  mintedPkp,
  pkpSessionSigs,
}: any) => {
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 bg-gradient-to-b from-blue-500 to-blue-300">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white">PrivI</h1>
        <p className="mt-4 text-lg text-white">
          {JSON.stringify(searchParams)}
        </p>
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
          botName={botName}
          buttonSize="large"
          dataOnauth={handleTelegramResponse}
        />
      </footer>
      {isUserValid && (
        <div className="card">
          <h4>Step 2: Mint PKP</h4>
          <button onClick={handleMintPkp} disabled={!!mintedPkp}>
            {mintedPkp ? "PKP Minted" : "Mint PKP"}
          </button>
          {mintedPkp && (
            <div>
              <p>Successfully minted PKP!</p>
              <p>Check the JavaScript console for PKP info</p>
            </div>
          )}
          <hr />
        </div>
      )}

      {mintedPkp && (
        <div className="card">
          <h4>Step 3: Get PKP Session Signatures</h4>
          <button onClick={handleGetPkpSessionSigs} disabled={!!pkpSessionSigs}>
            {pkpSessionSigs ? "Session Sigs Retrieved" : "Get PKP Session Sigs"}
          </button>
          {pkpSessionSigs && (
            <div>
              <p>Successfully generated Session Signatures!</p>
              <p>Check the JavaScript console for Session Sigs info</p>
            </div>
          )}
          <hr />
        </div>
      )}

      {/* Display URL parameters if they exist */}
      {(referralCode || source) && (
        <div className="mt-4 text-white">
          {referralCode && <p>Referral Code: {referralCode}</p>}
          {source && <p>Source: {source}</p>}
        </div>
      )}
    </div>
  );
};

export default LandingPageUI;
