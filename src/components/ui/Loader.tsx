import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';

interface LoaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const Loader = ({ className, size = 'md' }: LoaderProps) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex items-center justify-center">
            <AiOutlineLoading3Quarters
                className={cn('animate-spin text-blue-600', sizeClasses[size], className)}
            />
        </div>
    );
};

export default Loader;
