import Image from 'next/image';

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E6934A] p-4">
      {/* Main Card Container */}
      <div className="bg-white rounded-[40px] shadow-xl w-full max-w-md p-8 pt-0 flex flex-col items-center">
        
        {/* Logo Section - Positioned to overlap the top slightly */}
        <div className="bg-white p-4 rounded-b-2xl shadow-sm mb-6">
          <Image 
            src="/logo.png" // Ensure your logo is in the public folder
            alt="Sumaga Institute Logo" 
            width={100} 
            height={100} 
            className="object-contain"
          />
          <p className="text-[10px] text-center font-bold tracking-widest text-gray-500 mt-1 uppercase">
            Sumaga Institute
          </p>
          <p className="text-[8px] text-center text-gray-400 uppercase">Batagama</p>
        </div>

        {/* Form Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          Change Password
        </h1>

        {/* Change Password Form */}
        <form className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700 ml-1">
              New Password
            </label>
            <input 
              type="password" 
              className="w-full bg-[#EEEEEE] border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-orange-300 outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700 ml-1">
              Confirm Password
            </label>
            <input 
              type="password" 
              className="w-full bg-[#EEEEEE] border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-orange-300 outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <button 
              type="submit" 
              className="bg-[#001B3D] text-white text-xl font-bold py-3 px-16 rounded-full hover:bg-black transition-colors duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}