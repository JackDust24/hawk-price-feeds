'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PriceFeedRequest } from '../lib/types';

const API_URL = process.env.API_URL ?? 'http://localhost:8080/api';

type ValidationError = {
  message: string;
  errors: Record<string, string[]>;
};

type PriceFeedResponse = ValidationError | string;

export const getPriceFeed = async ({
  priceInfo,
}: PriceFeedRequest): Promise<any> => {
  try {
    await axios.post(`${API_URL}/price-update`, priceInfo, {
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
