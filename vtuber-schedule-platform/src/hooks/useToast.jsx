import { useState } from 'react';
import Toast from '../components/Toast';

/**
 * Notifikasi ringan. Pemakaian:
 *   const toast = useToast();
 *   toast.notify('Tersimpan');        // lalu render {toast.element}
 */
export function useToast() {
  const [state, setState] = useState({ message: '', tone: 'success', key: 0 });

  const notify = (message, tone = 'success') =>
    setState((prev) => ({ message, tone, key: prev.key + 1 }));

  const clear = () => setState((prev) => ({ ...prev, message: '' }));

  const element = (
    <Toast key={state.key} message={state.message} tone={state.tone} onDone={clear} />
  );

  return { notify, element };
}
