import { Dialog, DialogPanel } from '@headlessui/react'
import Button from './Button'
import FullScreenLoader from './FullScreenLoader'

const ConfirmVote = ({ isOpen, setIsOpen, candidateNames, handleVote, isLoading }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <DialogPanel
        className="
          dark:bg-card-dark bg-card-light 
          dark:text-primary-dark text-primary-light 
          relative shadow-xl w-full max-w-md p-6 rounded-lg
          max-h-[90vh] min-h-0 flex flex-col gap-6 overflow-hidden
        "
      >
        <div className="border-b border-gray-500 w-full pb-2 pt-1">
          <h2 className="text-lg text-center">Confirm your vote</h2>
        </div>
        <div className="flex flex-col text-sm gap-3">
          <p className="text-center">
            You are about to cast your vote, once submitted, this action cannot be changed.
          </p>
          <div className="flex flex-col">
            <div className="grid grid-cols-[8ch_2ch_auto] px-3 w-full">
              <span>General</span>
              <span>-</span>
              <span>{candidateNames?.general}</span>
            </div>

            {candidateNames.reserved && (
              <div className="grid grid-cols-[8ch_2ch_auto] px-3 w-full">
                <span>Reserved</span>
                <span>-</span>
                <span>{candidateNames?.reserved}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-3 w-full">
          <Button
            text="Cancel"
            className="w-1/2 h-11 text-sm bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark"
            type="button"
            onClick={() => {
              setIsOpen(false)
            }}
          />
          <Button
            text="Confirm Vote"
            className="w-1/2 h-11 text-sm bg-accent hover:bg-button-hover"
            type="button"
            onClick={handleVote}
            disabled={isLoading}
          />
        </div>
      </DialogPanel>
      {isLoading && (
        <div className="flex justify-between items-center">
          <FullScreenLoader />
        </div>
      )}
    </Dialog>
  )
}

export default ConfirmVote
