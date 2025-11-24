export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-black text-white">
      {/* Center Logo */}
      <div className="flex flex-1 items-center justify-center">
        <img
          src="/messenger_logo.jpg"
          alt="Messenger Logo"
          className="w-[60px] h-[60px] object-contain"
        />
      </div>

      {/* Bottom "From Meta" section */}
      <div className="pb-8 text-center leading-none">
        <p className="text-gray-400 font-semibold text-sm mb-[0px]">from</p>
        <div className="flex items-center justify-center">
          <img
            src="/meta-logo.jpg"
            alt="Meta Logo"
            className="w-[70px] h-[70px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
