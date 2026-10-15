import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export type UniversalModalSize = "sm" | "md" | "lg" | "xl" | "2xl";

export interface UniversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: UniversalModalSize;
  showCloseButton?: boolean;
  disableClose?: boolean;
  className?: string;
  ariaLabel?: string;
}

const sizeClasses: Record<UniversalModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
};

export default function UniversalModal({
  isOpen,
  onClose,
  children,
  size = "lg",
  showCloseButton = true,
  disableClose = false,
  className = "",
  ariaLabel = "Modal",
}: UniversalModalProps) {
  const handleClose = () => {
    if (!disableClose) onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        aria-label={ariaLabel}
        onClose={handleClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all dark:bg-secondary-800 ${sizeClasses[size]} ${className}`}
              >
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={disableClose}
                    aria-label="Close modal"
                    className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-secondary-400 transition-colors hover:bg-secondary-100 hover:text-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-secondary-700 dark:hover:text-secondary-200"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}

                <div className="max-h-[calc(100vh-2rem)] overflow-y-auto">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}