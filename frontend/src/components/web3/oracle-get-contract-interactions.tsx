'use client'

import { FC, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import { zodResolver } from '@hookform/resolvers/zod'
import OracleContract from '@inkathon/contracts/typed-contracts/contracts/oracle'
import { useInkathon, useRegisteredTypedContract } from '@scio-labs/use-inkathon'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  key: z.string().min(1), // Adjust according to your key validation requirements
})

export const OracleGetContractInteractions: FC = () => {
  const { api, activeAccount } = useInkathon()
  const { typedContract } = useRegisteredTypedContract(ContractIds.Oracle, OracleContract)
  const [getValue, setGetValue] = useState<string | null>(null)
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { register, reset, handleSubmit } = form

  const fetchValue = async (formData: { key: string }) => {
    if (!typedContract || !api) {
      toast.error('Contract or API not available')
      return
    }

    setFetchIsLoading(true)
    try {
      const key = formData.key
      const result = await typedContract.query.get([key])

      const value = result?.toString() || 'Value not found'
      setGetValue(value)
    } catch (error) {
      console.error(error)
      toast.error('Error while fetching value. Try again…')
      setGetValue(null)
    } finally {
      setFetchIsLoading(false)
    }
  }

  return (
    <div className="flex max-w-[22rem] grow flex-col gap-4">
      <h2 className="text-center font-mono text-gray-400">Fetch Value from Oracle</h2>
      <Form {...form}>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(fetchValue)} className="flex flex-col gap-2">
              <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Input {...register('key')} disabled={fetchIsLoading} />
                </FormControl>
              </FormItem>
              <FormItem>
                <Button type="submit" disabled={fetchIsLoading}>
                  Fetch Value
                </Button>
              </FormItem>
              {getValue !== null && (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input value={getValue} disabled={true} />
                  </FormControl>
                </FormItem>
              )}
            </form>
          </CardContent>
        </Card>
      </Form>
    </div>
  )
}
