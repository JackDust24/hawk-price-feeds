'use client';

import { time } from 'console';
import { z } from 'zod';

export const formSchema = z.object({
  aSymbol: z.string().min(2).max(6, {
    message: 'Symbol must be between 2 and 6 characters',
  }),
  bSymbol: z.string().min(2).max(6, {
    message: 'Symbol must be between 2 and 6 characters',
  }),
  multiplier: z.coerce.number().min(1).max(24, {
    message: 'Must be a number between 1 and 24',
  }),
  timespan: z.enum(['hour', 'day', 'week', 'month', 'year'], {
    message: 'Please add hour, day, week, month, or year',
  }),
  from: z.string().date(),
  to: z.string().date(),
});
