'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formSchema } from '../data/form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getPriceFeed } from '../api/api';
import axios from 'axios';

export default function PriceForm() {
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setIsError] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aSymbol: '',
      bSymbol: '',
      multiplier: 1,
      timespan: 'day',
      from: '2024-05-10',
      to: '2024-05-11',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const priceInfo = {
      event: 'price-update',
      priceData: {
        symbols: [form.getValues().aSymbol, form.getValues().bSymbol] as [
          string,
          string
        ],
        multiplier: form.getValues().multiplier,
        timespan: form.getValues().timespan,
        from: form.getValues().from,
        to: form.getValues().to,
      },
    };

    const request = await getPriceFeed({ priceInfo });
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='bg-white p-8 justify-between gap-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2'
      >
        <FormField
          control={form.control}
          name='aSymbol'
          render={({ field }) => (
            <FormItem className='items-start text-start w-80'>
              <FormLabel className='font-bold'>First symbol</FormLabel>
              <FormControl>
                <Input placeholder='AAPL' {...field} className='border-2' />
              </FormControl>
              <FormDescription>
                Specify a case-sensitive ticker symbol. For example, AAPL
                represents Apple Inc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bSymbol'
          render={({ field }) => (
            <FormItem className='items-start text-start w-80 '>
              <FormLabel className='font-bold'>Second symbol</FormLabel>
              <FormControl>
                <Input placeholder='GOOGL' {...field} className='border-2' />
              </FormControl>
              <FormDescription>
                Specify a second case-sensitive ticker symbol.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='multiplier'
          render={({ field }) => (
            <FormItem className='items-start text-start w-80 '>
              <FormLabel className='font-bold'>Multiplier</FormLabel>
              <FormControl>
                <Input
                  placeholder='1'
                  type='number'
                  onChange={(event) => field.onChange(+event.target.value)}
                  {...field}
                  className='border-2'
                />
              </FormControl>
              <FormDescription>
                The size of the timespan multiplier.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='timespan'
          render={({ field }) => (
            <FormItem className='items-start text-start w-80 '>
              <FormLabel className='font-bold'>Timespan</FormLabel>
              <FormControl>
                <Input placeholder='day' {...field} className='border-2' />
              </FormControl>
              <FormDescription>The size of the time window.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='from'
          render={({ field }) => (
            <FormItem className='items-start text-start w-80 '>
              <FormLabel className='font-bold'>From:</FormLabel>
              <FormControl>
                <Input
                  placeholder='2023-03-10'
                  {...field}
                  className='border-2'
                />
              </FormControl>
              <FormDescription>
                The start of the aggregate time window with a date with the
                format YYYY-MM-DD.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='to'
          render={({ field }) => (
            <FormItem className='items-start text-start w-80 '>
              <FormLabel className='font-bold'>To:</FormLabel>
              <FormControl>
                <Input
                  placeholder='2023-03-20'
                  {...field}
                  className='border-2'
                />
              </FormControl>
              <FormDescription>
                The end of the aggregate time window with a date with the format
                YYYY-MM-DD.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='col-span-2 flex justify-center mt-4'>
          <Button
            type='submit'
            className='flex justify-center items-center w-60 text-xl p-6'
          >
            Submit
          </Button>
        </div>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error?.message}</p>}
    </Form>
  );
}
