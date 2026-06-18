import { ReactNode, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { cn } from '@/lib/utils';
import Card from './Card';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    className?: string;
}

const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
            <div className="absolute inset-0" onClick={onClose} />
            <Card className={cn("relative w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200", className)}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <IoClose className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </Card>
        </div>
    );
};

export default Modal;
