function MultipleProgressBar({ applicants, totalApplicants }) {
 
  return (
    <div className="flex w-full h-[10px]">
      {applicants && Object?.keys(applicants)?.map((current,idx) => {
        const width = (applicants[current].length / totalApplicants) * 100;
        return (
          <div
          key={idx}
            style={{ width: `${width}%` }}
            className={` list-item h-full`}
          />
        );
      })}
    </div>
  );
}

export default MultipleProgressBar;
