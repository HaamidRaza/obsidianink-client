export const FormField = ({ label, children }) => (
  <div>
    <label className="meta block mb-3">{label}</label>
    {children}
  </div>
);


export const LoadingState = ({ message }) => (
  <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="article text-center">
      <p className="meta">{message}</p>
    </div>
  </div>
);

export const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);