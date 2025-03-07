function ProgressBar({ measured, total }) {
  const progress = Math.min((measured / total) * 100, 100); // Ensure progress doesn't exceed 100%
  
  return (
    <div className="relative w-full h-[10px] bg-gray-300 rounded-full overflow-hidden">
      {/* Background Bar */}
      <div
        style={{ width: `${progress}%` }}
        className="h-full bg-primaryColor transition-all duration-300 ease-in-out"
      />
      {/* Percentage Label */}
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-gray-700">
        {`${Math.round(progress)}%`}
      </span>
    </div>
  );
}

export default ProgressBar;
