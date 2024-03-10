'use client'

import { useEffect } from 'react'

import { useInkathon } from '@scio-labs/use-inkathon'
import { toast } from 'react-hot-toast'

import { HomePageTitle } from '@/app/components/home-page-title'
import { ConnectButton } from '@/components/web3/connect-button'
import { OracleAllowlistContractInteractions } from '@/components/web3/oracle-allowlist-contract-interactions'
import { OracleGetPairContractInteractions } from '@/components/web3/oracle-get-pair-contract-interactions'
import { ReceiverContractInteractions } from '@/components/web3/receiver-contract-interactions'

export default function HomePage() {
  // Display `useInkathon` error messages (optional)
  const { error } = useInkathon()
  useEffect(() => {
    if (!error) return
    toast.error(error.message)
  }, [error])

  return (
    <>
      <div className="container relative flex grow flex-col items-center justify-center py-10">
        {/* Title */}
        <HomePageTitle />

        {/* Connect Wallet Button */}
        <ConnectButton />

        <div className="mt-12 flex w-full flex-wrap items-start justify-center gap-4">
          {/* Chain Metadata Information */}
          {/* <ChainInfo /> */}

          {/* Receiver Read/Write Contract Interactions */}
          <ReceiverContractInteractions />
          {/* Oracle Allowlist Read/Write Contract Interactions */}
          <OracleAllowlistContractInteractions />
          {/* Oracle Get Interactions */}
          <OracleGetPairContractInteractions />
          {/* Oracle Get Interactions */}
          {/* <OracleGetContractInteractions /> */}
        </div>
      </div>
    </>
  )
}
