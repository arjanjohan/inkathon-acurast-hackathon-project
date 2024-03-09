'use client'

import { FC, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import { zodResolver } from '@hookform/resolvers/zod'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { useInkathon, useRegisteredContract } from '@scio-labs/use-inkathon'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

const formSchema = z.object({
  walletAddress: z.string().min(1).max(90),
})

export const OracleAllowlistContractInteractions: FC = () => {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.Oracle)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { register, reset, handleSubmit } = form

  const isValidAZeroAddress = (address: string) => {
    try {
      const decodedAddress = decodeAddress(address)
      const encodedAddress = encodeAddress(decodedAddress)
      return address === encodedAddress
    } catch (error) {
      return false
    }
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
  }

  const allow: SubmitHandler<z.infer<typeof formSchema>> = async ({ walletAddress }) => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    if (!isValidAZeroAddress(walletAddress)) {
      toast.error('Invalid Aleph Zero address. Please check the input and try again.')
      return
    }

    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'allow', {}, [walletAddress])
      setStatusMessage(`Address ${formatAddress(walletAddress)} is now APPROVED!`)
      reset()
    } catch (e) {
      console.error(e)
    }
  }

  const disallow: SubmitHandler<z.infer<typeof formSchema>> = async ({ walletAddress }) => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    if (!isValidAZeroAddress(walletAddress)) {
      toast.error('Invalid Aleph Zero address. Please check the input and try again.')
      return
    }

    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'disallow', {}, [
        walletAddress,
      ])
      setStatusMessage(`Address ${formatAddress(walletAddress)} is now BANNED!`)
      reset()
    } catch (e) {
      console.error(e)
    }
  }

  if (!api) return null

  return (
    <>
      <div className="flex max-w-[22rem] grow flex-col gap-4">
        <h2 className="text-center font-mono text-gray-400">Oracle allowlist</h2>

        {/* Form for Allow/Disallow */}
        <Form {...form}>
          <Card>
            <CardContent className="pt-6">
              <form className="flex flex-col justify-end gap-2">
                <FormItem>
                  <FormLabel className="text-base">Wallet Address</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                      {...register('walletAddress')}
                    />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <div className="flex justify-center gap-2">
                    <Button
                      type="button"
                      className="bg-primary font-bold"
                      disabled={fetchIsLoading || form.formState.isSubmitting}
                      isLoading={form.formState.isSubmitting}
                      onClick={() => handleSubmit(allow)()}
                    >
                      Allow
                    </Button>
                    <Button
                      type="button"
                      className="bg-primary font-bold"
                      disabled={fetchIsLoading || form.formState.isSubmitting}
                      isLoading={form.formState.isSubmitting}
                      onClick={() => handleSubmit(disallow)()}
                    >
                      Disallow
                    </Button>
                  </div>
                  {/* Status Message Display */}
                  {statusMessage && <p className="mt-4 text-center">{statusMessage}</p>}
                </FormItem>
              </form>
            </CardContent>
          </Card>
        </Form>
        <p className="text-center font-mono text-xs text-gray-600">
          {contract ? contractAddress : 'Loading…'}
        </p>
      </div>
    </>
  )
}
