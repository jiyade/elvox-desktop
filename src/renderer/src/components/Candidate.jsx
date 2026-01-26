const Candidate = ({ candidate, selected, onClick, tabIndex }) => {
  return (
    <button
      className={`flex flex-col items-center gap-1 px-2 py-4 rounded-sm cursor-pointer border border-gray-500 bg-gray-400/20 dark:bg-gray-700/20 outline-none transition-transform duration-200 ease-out will-change-transform shadow-black/20 dark:shadow-white/8 hover:-translate-y-1 hover:shadow-xl ${
        selected?.ballot_entry_id === candidate?.ballot_entry_id
          ? 'ring-2 ring-accent border-none -translate-y-1'
          : 'focus:ring-1 focus:ring-accent focus:border-none focus:-translate-y-1 focus:shadow-xl'
      } ${candidate?.is_nota ? 'justify-center' : 'justify-between'}
`}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {!candidate?.is_nota ? (
        <>
          <div className="flex flex-col items-center gap-2">
            <img
              src={candidate?.profile_pic}
              alt={candidate?.name}
              className="w-24 h-24 rounded-full"
            />
            <h3 className="text-primary-light dark:text-primary-dark text-base text-center">
              {candidate?.name}
            </h3>
          </div>
          <div className="flex max-lg:flex-col lg:gap-1 items-center text-sm">
            <p>{candidate?.class}</p>
            <p className="max-lg:hidden">-</p>
            <p>Semester {candidate?.semester}</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center justify-center w-24 h-24 border border-gray-500 text-center rounded-full font-semibold text-xl">
              NOTA
            </p>
            <h3 className="text-primary-light dark:text-primary-dark text-base text-center">
              None of the Above
            </h3>
          </div>
        </>
      )}
    </button>
  )
}

export default Candidate
