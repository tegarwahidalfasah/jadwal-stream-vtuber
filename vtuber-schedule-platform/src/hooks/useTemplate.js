import { useContext } from 'react';
import { TemplateContext } from '../context/TemplateContext';

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate harus digunakan dalam TemplateProvider');
  }
  return context;
}
