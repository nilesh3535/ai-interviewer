// ViewToast.tsx
'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function ViewToast() {
  const params = useSearchParams();
  const view = params.get('view');

  useEffect(() => {
    if (view === 'grid') {
        toast.info(`Grid view`, {
            duration: 1000,          
          });
    }else{
       toast.info(`List view`, {
            duration: 1000,          
          });
    }
  }, [view]);

  return null;
}
