'use client'

import { FC, useEffect, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

export const ReceiverContractInteractions: FC = () => {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.Receiver)
  const [randomOutcome, setRandomOutcome] = useState<boolean>()
  const [isFlipping, setIsFlipping] = useState<boolean>(false)

  const fetchOutcome = async () => {
    if (!contract || !api) return

    try {
      const result = await contractQuery(api, '', contract, 'get')
      const { output, isError, decodedOutput } = decodeOutput(result, contract, 'get')
      if (isError) throw new Error(decodedOutput)
      setRandomOutcome(output)
      setIsFlipping(false) // Stop spinning once the result is fetched
    } catch (e) {
      console.error(e)
      toast.error('Error while fetching bytes. Try again…')
      setIsFlipping(false) // Stop spinning in case of an error
    }
  }

  useEffect(() => {
    fetchOutcome()
  }, [contract])

  const flipCoin = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    setIsFlipping(true) // Start spinning when button is clicked

    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'flip', {}, [])
      fetchOutcome() // Fetch the outcome after the transaction is complete
    } catch (e) {
      console.error(e)
      setIsFlipping(false) // Stop spinning in case of an error
    }
  }

  if (!api) return null

  return (
    <>
      <div className="flex max-w-[22rem] grow flex-col gap-4">
        <h2 className="text-center font-mono text-gray-400">Acurast Randomness</h2>

        <Card>
          <CardContent className="pt-6">
            <p className="text-base">
              Random outcome:{' '}
              {randomOutcome !== undefined ? (randomOutcome ? 'Heads' : 'Tails') : 'Loading…'}
            </p>
          </CardContent>
        </Card>
        <Button onClick={flipCoin} className="bg-primary font-bold" disabled={isFlipping}>
          Flip Coin
        </Button>

        <p className="text-center font-mono text-xs text-gray-600">
          {contract ? contractAddress : 'Loading…'}
        </p>
      </div>
    </>
  )
}
