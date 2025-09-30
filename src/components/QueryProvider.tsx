'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

type TQueryProvider = {
    children: React.ReactNode;
}

export function QueryProvider({ children }: TQueryProvider) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,
                        gcTime: 10 * 60 * 1000,
                        retry: (failureCount, error) => {
                            if (error instanceof Error && 'status' in error) {
                                const status = (error as any).status;
                                if (status >= 400 && status < 500) {
                                    return false;
                                }
                            }
                            return failureCount < 2;
                        },
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: true,
                        refetchOnMount: true,
                    },
                    mutations: {
                        retry: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}
