import { toast, ToastOptions, Slide } from 'react-toastify';

const commonOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  closeButton: false,
  transition: Slide,
};

const showToast = {
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...commonOptions,
      ...options,
      toastId: 'error',
    });
  },
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...commonOptions,
      ...options,
      toastId: 'success',
    });
  },
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      ...commonOptions,
      ...options,
      toastId: 'info',
    });
  },
};

export default showToast;
