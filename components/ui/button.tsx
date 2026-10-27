import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
const variants = cva('inline-flex items-center justify-center rounded-sm px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:pointer-events-none disabled:opacity-50', { variants: { variant: { default: 'bg-signal text-white hover:bg-[#465f4a]', outline: 'border border-stone-300 text-mist hover:border-signal', ghost: 'text-stone-500 hover:text-mist' } }, defaultVariants: { variant: 'default' } });
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof variants> { asChild?: boolean }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, asChild, ...props }, ref) => { const Comp = asChild ? Slot : 'button'; return <Comp className={cn(variants({ variant }), className)} ref={ref} {...props} />; });
Button.displayName = 'Button';
