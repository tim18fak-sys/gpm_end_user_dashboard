import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  IdentificationIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import Celebration from "@/components/ui/Celebration";
import ImageUpload from "@/components/smart_components/SingleImageUpload";
import { api } from "@/services/api";
import { PublicApiConst } from "@/const/upload.const";
import { useVerifyNinManually } from "@/hooks/useKyc";
// import { Transition, Dialog } from '@headlessui/react'

const steps = [
  {
    icon: IdentificationIcon,
    title: "Enter Your NIN",
    description: "Provide your National Identification Number for verification",
  },
  {
    icon: DocumentTextIcon,
    title: "Upload Document",
    description: "Upload a clear photo or scan of a valid government-issued ID",
  },
  {
    icon: ShieldCheckIcon,
    title: "Get Verified",
    description: "Your details will be reviewed and verified securely",
  },
];

const Kyc = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  // const [slide, setSlide] = useState(0)
  // const [direction, setDirection] = useState(1)
  const [nin, setNin] = useState("");
  const [ninError, setNinError] = useState("");

  // const [capturedImage, setCapturedImage] = useState<string | null>(null)
  // const [cameraReady, setCameraReady] = useState(false)
  // const [cameraError, setCameraError] = useState('')
  // const [showFailModal, setShowFailModal] = useState<boolean>(false);

  const [showCelebration, setShowCelebration] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");
  const [docError, setDocError] = useState("");

  const { mutate: verifyNin, isPending: isSubmitting } = useVerifyNinManually();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (!nin.trim()) {
      setNinError("NIN is required");
      valid = false;
    } else if (nin.trim().length < 11) {
      setNinError("NIN must be at least 11 characters");
      valid = false;
    } else {
      setNinError("");
    }

    if (!documentUrl) {
      setDocError("Please upload a document before submitting");
      valid = false;
    } else {
      setDocError("");
    }

    if (!valid) return;

    verifyNin(
      { nin: nin.trim(), documentUrl },
      { onSuccess: () => setShowCelebration(true) },
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-16 aspect-square"
              />
            </div>
            <h2 className="text-2xl font-bold text-center text-secondary-900 dark:text-white">
              Identity Verification
            </h2>
            <p className="text-center text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              Complete your KYC to activate your account
            </p>
          </div>

          <div className="px-8 py-6">
            {!started ? (
              /* ── Intro screen (step 1) ── */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.4 }}
                      className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-secondary-700/50 rounded-xl border border-gray-200 dark:border-secondary-600"
                    >
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-3">
                        <step.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h4 className="text-sm font-semibold text-secondary-900 dark:text-white mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-1">
                        Secure Verification
                      </p>
                      <p className="text-sm text-primary-700 dark:text-primary-300">
                        Your documents and NIN are processed securely. We only
                        use this information to verify your identity.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStarted(true)}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none transition-colors"
                >
                  Begin Verification
                </motion.button>
              </motion.div>
            ) : (
              /* ── Manual NIN verification form ── */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Submitting overlay */}
                {isSubmitting && (
                  <div className="absolute inset-0 z-10 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mb-4" />
                    <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Submitting your details...
                    </p>
                  </div>
                )}

                {/* Back link */}

                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={() => setStarted(false)}
                    className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 transition-colors"
                  >
                    &larr; Back
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* NIN field */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                      National Identification Number (NIN)
                    </label>
                    <input
                      type="text"
                      value={nin}
                      onChange={(e) => {
                        setNin(e.target.value);
                        if (ninError) setNinError("");
                      }}
                      placeholder="Enter your 11-digit NIN"
                      maxLength={20}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-700 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                        ninError
                          ? "border-red-400 dark:border-red-500"
                          : "border-secondary-300 dark:border-secondary-600"
                      }`}
                    />
                    {ninError && (
                      <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                        {ninError}
                      </p>
                    )}
                  </div>

                  {/* Document upload */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                      Government-issued ID Document
                    </label>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-2">
                      Upload a clear photo or scan of your NIN slip, national ID
                      card, voter's card, or passport.
                    </p>

                    {documentUrl ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      >
                        <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">
                            Document uploaded successfully
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDocumentUrl("")}
                          className="text-xs text-green-700 dark:text-green-400 hover:underline shrink-0"
                        >
                          Replace
                        </button>
                      </motion.div>
                    ) : (
                      <ImageUpload
                        axiosInstance={api}
                        uploadUrl={PublicApiConst.RESOURCE_SINGLE_UPLOAD_URL}
                        resourceType="image"
                        acceptedFormats={[
                          "image/jpeg",
                          "image/png",
                          "image/webp",
                          "application/pdf",
                        ]}
                        maxSizeMB={10}
                        onUploadSuccess={({ url }) => {
                          setDocumentUrl(url);
                          if (docError) setDocError("");
                        }}
                      />
                    )}

                    {docError && (
                      <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                        {docError}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    {isSubmitting ? "Submitting..." : "Submit for Verification"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Celebration */}
      <Celebration
        show={showCelebration}
        title="Verification Submitted!"
        subtitle="Your details are being reviewed"
        message="We will verify your NIN and document, then notify you once the review is complete. This usually takes a few minutes to 2 business days. Thank you for your patience!"
        buttonText="Continue"
        onButtonClick={() => navigate("/kyc/pending-review", { replace: true })}
      />

      {/* NIN Verification Failure Modal */}
      {/* <Transition appear show={showFailModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowFailModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white dark:bg-secondary-800 shadow-2xl transition-all">
                  <div className="p-6">
                    <button
                      onClick={() => setShowFailModal(false)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-secondary-400" />
                    </button>

                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <Dialog.Title className="text-base font-semibold text-secondary-900 dark:text-white mb-2">
                          Verification Failed
                        </Dialog.Title>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
                          {failMessage}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 w-full pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleRetake}
                          className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                          <ArrowPathIcon className="w-4 h-4" /> Retake Selfie
                        </motion.button>
                        <button
                          onClick={() => { setShowFailModal(false); goToSlide(0) }}
                          className="w-full py-2.5 border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 font-medium rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors text-sm"
                        >
                          Change NIN
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}
    </div>
  );
};

export default Kyc;
