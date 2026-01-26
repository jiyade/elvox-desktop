import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/api'
import FullScreenLoader from '../components/FullScreenLoader'
import Button from '../components/Button'
import Candidate from '../components/Candidate'
import ConfirmVote from '../components/ConfirmVote'
import BallotScreenFooter from '../components/BallotScreenFooter'
import CandidatesContainer from '../components/CandidatesContainer'

const semToYear = (sem) => {
  if (sem <= 2) return '1st Year'
  if (sem <= 4) return '2nd Year'
  if (sem <= 6) return '3rd Year'
  return '4th Year'
}

const BallotScreen = ({ voterData, electionId, onFinish }) => {
  const [candidates, setCandidates] = useState([])
  const [classData, setClassData] = useState(null)
  const [selectedCandidates, setSelectedCandidates] = useState({ general: null, reserved: null })
  const [activeCategory, setActiveCategory] = useState('general')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const hasSelectedBothCategories =
    selectedCandidates?.general !== null && selectedCandidates?.reserved !== null

  const handleVote = async () => {
    if (hasVoted) return

    try {
      setIsLoading(true)

      await api.post(`/elections/${electionId}/vote`, {
        admno: voterData.admno,
        votingToken: voterData.votingToken,
        votes: {
          general: selectedCandidates?.general?.ballot_entry_id,
          reserved: selectedCandidates?.reserved?.ballot_entry_id
        }
      })

      setHasVoted(true)

      // PLAY BEEP SOUND
      const audio = new Audio(new URL('../assets/sounds/vote-cast.mp3', import.meta.url).href)
      audio.onended = () => {
        onFinish()
      }

      toast.success('Vote cast successfully', { id: 'cast-vote-success' })

      audio.play()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong', {
        id: 'cast-vote-error'
      })
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
    }
  }

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true)

        const res = await api.get(`/candidates?class=${voterData.classId}&election=${electionId}`)

        setCandidates(res?.data)

        setClassData({
          name: res?.data?.general[0]?.class || 'Unknown Class',
          year: semToYear(res?.data?.general[0]?.semester) || 'Unknown Year'
        })
      } catch (err) {
        toast.error(err.response?.data?.error || 'Something went wrong', {
          id: 'fetch-candidates-error'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCandidates()
  }, [electionId, voterData.classId])

  return (
    <div className="flex flex-1 py-3">
      <div className="flex flex-col justify-center flex-1">
        {Object.keys(candidates)?.length > 0 && !isLoading && (
          <div className="flex flex-col flex-1 gap-6 items-center">
            <div className="flex w-full items-center">
              <h2 className="font-semibold text-lg">
                {classData?.name}, {classData?.year}
              </h2>
            </div>

            <div className="flex flex-col w-full lg:max-w-6xl mt-4 px-4 flex-1 gap-2 divide-gray-500 divide-y overflow-hidden">
              <h3 className="text-center font-semibold text-lg pb-2">
                {activeCategory === 'general' ? 'General Candidates' : 'Reserved Candidates'}
              </h3>

              <div className="overflow-hidden flex-1">
                <div
                  className={`flex h-full w-[200%] transition-transform duration-300 ease-in-out ${
                    activeCategory === 'general' ? 'translate-x-0' : '-translate-x-1/2'
                  }`}
                >
                  <CandidatesContainer>
                    {candidates?.general?.map((candidate) => (
                      <Candidate
                        key={candidate?.ballot_entry_id}
                        candidate={candidate}
                        selected={selectedCandidates?.general}
                        onClick={() =>
                          setSelectedCandidates((selected) => ({
                            ...selected,
                            general: candidate
                          }))
                        }
                        tabIndex={activeCategory === 'general' ? 0 : -1}
                      />
                    ))}
                  </CandidatesContainer>
                  <CandidatesContainer>
                    {candidates?.reserved?.map((candidate) => (
                      <Candidate
                        key={candidate?.ballot_entry_id}
                        candidate={candidate}
                        selected={selectedCandidates?.reserved}
                        onClick={() =>
                          setSelectedCandidates((selected) => ({
                            ...selected,
                            reserved: candidate
                          }))
                        }
                        tabIndex={activeCategory === 'reserved' ? 0 : -1}
                      />
                    ))}
                  </CandidatesContainer>
                </div>
              </div>

              <BallotScreenFooter
                hasSelectedBothCategories={hasSelectedBothCategories}
                selectedCandidates={selectedCandidates}
                activeCategory={activeCategory}
                showConfirmation={showConfirmation}
                hasVoted={hasVoted}
                setActiveCategory={setActiveCategory}
                setShowConfirmation={setShowConfirmation}
              />
            </div>
          </div>
        )}

        {Object.keys(candidates)?.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-base lg:text-lg">No candidates available for your class</p>
            <Button
              className="py-2 px-4 text-sm bg-accent hover:bg-button-hover"
              onClick={onFinish}
            >
              Return
            </Button>
          </div>
        )}
      </div>
      {showConfirmation && (
        <ConfirmVote
          isLoading={isLoading}
          isOpen={showConfirmation}
          setIsOpen={setShowConfirmation}
          candidateNames={{
            general: selectedCandidates?.general?.is_nota
              ? 'NOTA'
              : selectedCandidates?.general?.name,
            reserved: selectedCandidates?.reserved?.is_nota
              ? 'NOTA'
              : selectedCandidates?.reserved?.name
          }}
          handleVote={handleVote}
        />
      )}
      {isLoading && (
        <div className="flex justify-between items-center">
          <FullScreenLoader />
        </div>
      )}
    </div>
  )
}

export default BallotScreen
