import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Junta classes do Tailwind resolvendo conflitos.
 * Ex.: cn('p-2', condicao && 'p-4') devolve 'p-4' — sem isso as duas
 * ficariam no HTML e o resultado dependeria da ordem no CSS.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
