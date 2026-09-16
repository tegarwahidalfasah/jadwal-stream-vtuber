import { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Toast sederhana pengganti window.alert().
 * alert() memblokir thread dan tidak bisa di-styling; pada halaman OBS
 * (Browser Source) dialog bahkan tidak akan pernah ditutup oleh siapa pun.
 *
 * Animasi masuk/keluar sepenuhnya lewat CSS (@keyframes toast-life) sehingga
 * komponen ini tidak perlu setState di dalam effect.
 */
export default function Toast({ message, tone = 'success', onDone, duration = 2600 }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDone]);

  if (!message) return null;

  return (
    <div
      className={`toast toast-${tone}`}
      style={{ animationDuration: `${duration}ms` }}
      role="status"
      aria-live="polite"
    >
      {tone === 'error' ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
      <span>{message}</span>
    </div>
  );
}
