import TelegramLoginButton from "@/components/TelegramLoginButton";

const LandingPageUI = ({
  telegramUser,
  validationError,
  handleTelegramResponse,
  botName,
}: any) => {
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
          botName={botName}
          buttonSize="large"
          dataOnauth={handleTelegramResponse}
        />
      </footer>
    </div>
  );
};

export default LandingPageUI;
