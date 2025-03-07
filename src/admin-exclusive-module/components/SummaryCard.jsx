function SummaryCard({ title, description, value }) {
    return (
      <div className="rounded-lg border border-gray-200 shadow-md bg-white cursor-pointer hover:scale-105 transition duration-150 flex flex-col justify-between gap-4 p-6 h-full">
        <span className="text-green-700 text-xl font-semibold">{title}</span>
        <span className="text-gray-600 text-md">{description}</span>
        <span className="text-black text-3xl font-bold">{value}</span>
      </div>
    );
  }
  
  export default SummaryCard;
  