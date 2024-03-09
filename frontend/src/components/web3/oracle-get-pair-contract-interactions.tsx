import { FC, useState } from 'react'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'

import { pairOptions, sourceOptions } from '../ui/dropdown-options'

export const OracleGetContractInteractions: FC = () => {
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>(false)
  const [getValue, setGetValue] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      source: '',
      pair: '',
    },
  })

  const { register, handleSubmit } = form

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
                <FormControl>
                  <select {...register('source')} disabled={fetchIsLoading}>
                    <option value="">Select Source</option>
                    {sourceOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Pair</FormLabel>
                <FormControl>
                  <select {...register('pair')} disabled={fetchIsLoading}>
                    <option value="">Select Pair</option>
                    {pairOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
