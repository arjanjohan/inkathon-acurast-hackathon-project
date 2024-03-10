import { FC, useEffect, useState } from 'react'

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
          <CardContent>
            <form onSubmit={handleSubmit(fetchValue)} className="flex flex-col gap-2">
              <FormItem>
                <FormLabel>Source</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="h-12 min-w-[14rem] gap-2 rounded-2xl border border-white/10 bg-primary px-4 py-3 font-bold text-foreground transition-colors hover:bg-purple-600"
                      disabled={fetchIsLoading}
                      translate="no"
                    >
                      {sourceOptions.find((option) => option.value === watchSource)?.label ||
                        'Select Source'}
                      <FiChevronDown size={20} aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[14rem] rounded-2xl bg-gray-900">
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
              <FormItem>
                <FormLabel>Pair</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="h-12 min-w-[14rem] gap-2 rounded-2xl border border-white/10 bg-primary px-4 py-3 font-bold text-foreground"
                      disabled={fetchIsLoading}
                      translate="no"
                    >
                      {pairOptions.find((option) => option.value === watchPair)?.label ||
                        'Select Pair'}
                      <FiChevronDown size={20} aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[14rem] rounded-2xl bg-gray-900">
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
              <FormItem>
                <Button type="submit" disabled={fetchIsLoading}>
                  Fetch Value
                </Button>
              </FormItem>
              {getValue !== null && (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <input value={getValue} disabled={true} />
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
