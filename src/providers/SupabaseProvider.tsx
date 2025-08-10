'use client';

import { ReactNode } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';

type Props = { children: ReactNode };

export default function SupabaseProvider({ children }: Props) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}
