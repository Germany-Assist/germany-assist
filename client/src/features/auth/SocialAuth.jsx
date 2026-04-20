import GoogleLoginButton from "../../components/ui/googleLoginButton";

const SocialAuth = ({ mode }) => (
  <div className="mt-8">
    <div className="relative mb-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-widest">
        <span className="px-4 bg-[#0c0c0c] text-gray-500">Or {mode} with</span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <GoogleLoginButton nav={"/"} />
      <button
        type="button"
        className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all"
      >
        <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span className="text-sm font-medium">Facebook</span>
      </button>
    </div>
  </div>
);

export default SocialAuth;
