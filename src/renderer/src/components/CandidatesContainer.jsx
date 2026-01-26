const CandidatesContainer = ({ children }) => {
  return (
    <div className="flex flex-col w-1/2 shrink-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max gap-x-3 gap-y-4 overflow-y-auto custom-scrollbar flex-[1_1_0px] p-2 min-w-0">
        {children}
      </div>
    </div>
  )
}

export default CandidatesContainer
