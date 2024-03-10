import { FC, useEffect, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import { useRegisteredContract } from '@scio-labs/use-inkathon'
import { useForm } from 'react-hook-form'
import { FiChevronDown } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'

import { pairOptions, sourceOptions } from '../ui/dropdown-options'

export const OracleGetPairContractInteractions: FC = () => {
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>(false)
  const { contract } = useRegisteredContract(ContractIds.Receiver)

  const [getValue, setGetValue] = useState<string | null>(null)
  const [sourceSelected, setSourceSelected] = useState<boolean>(false)
  const [pairSelected, setPairSelected] = useState<boolean>(false)

  const form = useForm({
    defaultValues: {
      source: '',
      pair: '',
    },
  })

  const { register, handleSubmit, watch } = form

  const watchSource = watch('source')
  const watchPair = watch('pair')

  // Update selection status based on user choice
  useEffect(() => {
    setSourceSelected(watchSource !== '')
    setPairSelected(watchPair !== '')
  }, [watchSource, watchPair])

  const fetchValue = async () => {
    // Your fetch logic here
    setGetValue('Dummy Value') // Set to a dummy value for now
  }

  return (
    <div className="flex max-w-[22rem] grow flex-col gap-4">
      <h2 className="text-center font-mono text-gray-400">Fetch Value from Oracle</h2>
      <Form {...form}>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(fetchValue)} className="flex flex-col gap-4">
              {/* <div className="flex justify-between gap-4"> */}
              <FormItem className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button disabled={fetchIsLoading} translate="no" className="w-full">
                      {sourceOptions.find((option) => option.value === watchSource)?.label ||
                        'Select Source'}
                      <FiChevronDown size={20} aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-2xl bg-gray-900">
                    {sourceOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        className="cursor-pointer text-foreground"
                        onClick={() => form.setValue('source', option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormItem>
              <FormItem className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button disabled={fetchIsLoading} translate="no" className="w-full">
                      {pairOptions.find((option) => option.value === watchPair)?.label ||
                        'Select Pair'}
                      <FiChevronDown size={20} aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-2xl bg-gray-900">
                    {pairOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        className="cursor-pointer text-foreground"
                        onClick={() => form.setValue('pair', option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormItem>
              {/* </div> */}
            </form>
          </CardContent>
        </Card>
        {/* Button outside the card */}
        <Button
          className="bg-primary font-bold"
          type="submit"
          onClick={handleSubmit(fetchValue)}
          disabled={fetchIsLoading}
        >
          Get Value
        </Button>
        {getValue !== null && (
          <FormItem>
            <FormLabel>Value</FormLabel>
            <FormControl>
              <input value={getValue} disabled={true} />
            </FormControl>
          </FormItem>
        )}
      </Form>
      <p className="text-center font-mono text-xs text-gray-600">
        {contract ? contract.address : 'Loading…'}
      </p>
    </div>
  )
}
