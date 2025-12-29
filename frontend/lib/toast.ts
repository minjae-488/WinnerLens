import toast from 'react-hot-toast';

export const showToast = {
    success: (message: string) => {
        toast.success(message, {
            duration: 3000,
            position: 'top-right',
            style: {
                background: '#10b981',
                color: '#fff',
            },
        });
    },

    error: (message: string) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#ef4444',
                color: '#fff',
            },
        });
    },

    warning: (message: string) => {
        toast(message, {
            duration: 3500,
            position: 'top-right',
            icon: '⚠️',
            style: {
                background: '#f59e0b',
                color: '#fff',
            },
        });
    },

    info: (message: string) => {
        toast(message, {
            duration: 3000,
            position: 'top-right',
            icon: 'ℹ️',
            style: {
                background: '#3b82f6',
                color: '#fff',
            },
        });
    },

    loading: (message: string) => {
        return toast.loading(message, {
            position: 'top-right',
        });
    },

    dismiss: (toastId: string) => {
        toast.dismiss(toastId);
    },
};
