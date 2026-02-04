import Button from './Button'

const BallotScreenFooter = ({
  hasSelectedBothCategories,
  selectedCandidates,
  activeCategory,
  showConfirmation,
  hasVoted,
  setActiveCategory,
  setShowConfirmation
}) => {
  return (
    <div className="flex items-center justify-between mt-3">
      {hasSelectedBothCategories && (
        <div className="flex  gap-2 text-sm">
          <p>Selected:</p>
          <div className="flex flex-col gap-1">
            <p className="grid grid-cols-[8ch_2ch_auto]">
              <span>General</span>
              <span> - </span>
              {selectedCandidates?.general?.is_nota ? 'NOTA' : selectedCandidates?.general?.name}
            </p>
            <p className="grid grid-cols-[8ch_2ch_auto]">
              <span>Reserved</span>
              <span> - </span>
              {selectedCandidates?.reserved?.is_nota ? 'NOTA' : selectedCandidates?.reserved?.name}
            </p>
          </div>
        </div>
      )}
      {!hasSelectedBothCategories && (
        <p className="text-sm">
          Selected:{' '}
          {selectedCandidates?.general
            ? `General - ${selectedCandidates?.general?.is_nota ? 'NOTA' : selectedCandidates?.general?.name}`
            : selectedCandidates?.reserved
              ? `Reserved - ${selectedCandidates?.reserved?.is_nota ? 'NOTA' : selectedCandidates?.reserved?.name}`
              : 'none'}
        </p>
      )}
      <div className="flex w-60s items-center gap-3">
        {activeCategory === 'general' ? (
          <Button
            className="py-2 px-8 text-sm bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark"
            onClick={() => setActiveCategory('reserved')}
            disabled={showConfirmation || hasVoted || !selectedCandidates?.general}
          >
            Next
          </Button>
        ) : (
          <Button
            className="py-2 px-8 text-sm bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark"
            onClick={() => setActiveCategory('general')}
            disabled={showConfirmation || hasVoted}
          >
            Previous
          </Button>
        )}
        {hasSelectedBothCategories && (
          <Button
            className="py-2 px-8 text-sm bg-accent hover:bg-button-hover"
            onClick={() => setShowConfirmation(true)}
            disabled={showConfirmation || hasVoted || !hasSelectedBothCategories}
          >
            Vote
          </Button>
        )}
      </div>
    </div>
  )
}

export default BallotScreenFooter
