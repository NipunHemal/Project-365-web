import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'btn',
                    {
                        'btn-primary': variant === 'primary',
                        'btn-secondary': variant === 'secondary',
                        'btn-ghost': variant === 'ghost',
                    },
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
