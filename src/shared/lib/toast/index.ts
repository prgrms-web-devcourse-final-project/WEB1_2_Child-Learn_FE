import { toast, ToastOptions } from 'react-toastify';

const commonOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  closeButton: false,
};

const showToast = {
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...commonOptions,
      ...options,
    });
  },
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...commonOptions,
      ...options,
    });
  },
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      ...commonOptions,
      ...options,
    });
  },
};

export default showToast;
