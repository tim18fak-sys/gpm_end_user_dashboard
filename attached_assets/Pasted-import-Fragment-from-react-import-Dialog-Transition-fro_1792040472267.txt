import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type {
  UniversalModalProps,
  UniversalModalSize,
} from "./UniversalModal";

export type UniversalDrawerProps = UniversalModalProps;

const sizeClasses: Record<UniversalModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
};

/*
 * Usage example:
 *
 * import { UniversalDrawer } from "../components/reusable";
 *
 * <UniversalDrawer
 *   isOpen={isDrawerOpen}
 *   onClose={() => setIsDrawerOpen(false)}
 *   size="lg"
 *   ariaLabel="Customer details"
 * >
 *   <div className="p-6">
 *     <h2 className="text-lg font-semibold">Customer details</h2>
 *     <CustomerDetails customer={customer} />
 *   </div>
 * </UniversalDrawer>
 *
 * Prevent closing during an operation:
 *
 * <UniversalDrawer
 *   isOpen={isDrawerOpen}
 *   onClose={closeDrawer}
 *   disableClose={isSubmitting}
 *   showCloseButton
 *   className="border-l border-secondary-200 dark:border-secondary-700"
 * >
 *   <EditCustomerForm />
 * </UniversalDrawer>
 */

export default function UniversalDrawer({
  isOpen,
  onClose,
  children,
  size = "lg",
  showCloseButton = true,
  disableClose = false,
  className = "",
  ariaLabel = "Drawer",
}: UniversalDrawerProps) {
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
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className={`pointer-events-auto relative flex h-full w-screen flex-col overflow-hidden bg-white text-left shadow-2xl dark:bg-secondary-800 ${sizeClasses[size]} ${className}`}
                >
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={disableClose}
                      aria-label="Close drawer"
                      className="absolute left-4 top-4 z-10 rounded-lg p-1.5 text-secondary-400 transition-colors hover:bg-secondary-100 hover:text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-secondary-700 dark:hover:text-secondary-200"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}

                  <div className="h-full overflow-y-auto">{children}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}