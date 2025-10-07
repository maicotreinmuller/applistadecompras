import { toast } from 'react-toastify';

const toastConfig = {
  position: "top-center" as const,
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark" as const,
  className: "!rounded-xl !bg-violet-600/90 !backdrop-blur-lg !shadow-lg !font-medium !px-4 !py-3 !mt-14",
  bodyClassName: "!text-white !text-sm",
  icon: false,
};

export const notify = {
  success: (message: string) => toast(message, {
    ...toastConfig,
    icon: "✓",
  }),
  error: (message: string) => toast(message, {
    ...toastConfig,
    className: "!rounded-xl !bg-red-600/90 !backdrop-blur-lg !shadow-lg !font-medium !px-4 !py-3 !mt-14",
    icon: "✕",
  }),
  info: (message: string) => toast(message, {
    ...toastConfig,
    icon: "ℹ",
  }),
  warning: (message: string) => toast(message, {
    ...toastConfig,
    className: "!rounded-xl !bg-yellow-600/90 !backdrop-blur-lg !shadow-lg !font-medium !px-4 !py-3 !mt-14",
    icon: "⚠",
  })
};