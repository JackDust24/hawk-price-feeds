'use client';

import { useState } from 'react';
import axios from 'axios';
import { time } from 'console';
import { fromJSON } from 'postcss';

type ValidationError = {
  message: string;
  errors: Record<string, string[]>;
};

export function MockTrigger() {
  const sendPriceUpdate = async () => {
    const priceData = {
      event: 'price-update',
      priceData: {
        symbols: ['AAPL', 'GOOGL'],
        multiplier: JSON.stringify(1),
        timespan: 'day',
        from: '2024-05-10',
        to: '2024-05-21',
      },
    };

    try {
      await axios.post('http://localhost:8080/api/price-update', priceData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        console.error(error.response);
        alert(`Error: ${error.response}`);
      } else {
        console.error(error);
        alert(`Error: ${error}`);
      }
    }
  };

  return (
    <div>
      <h1>Real-Time Price Updates</h1>
      <button className='p-4 bg-green-300' onClick={sendPriceUpdate}>
        Update Price
      </button>
    </div>
  );
}
