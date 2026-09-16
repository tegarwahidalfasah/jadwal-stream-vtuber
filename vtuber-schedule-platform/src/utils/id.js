// ID unik untuk entity yang disimpan di localStorage.
// crypto.randomUUID() menghindari tabrakan yang bisa terjadi bila dua entitas
// dibuat dalam milidetik yang sama (pola lama memakai Date.now()).
export function createId(prefix) {
  const cryptoRef = globalThis.crypto;
  if (cryptoRef?.randomUUID) {
    return `${prefix}-${cryptoRef.randomUUID()}`;
  }
  // Fallback untuk lingkungan tanpa crypto.randomUUID.
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
