
import { ReactNode, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAuthStore } from '../store/authStore'
import useDeviceDetection from '@/hooks/useDeviceDetection'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  // Initialize sidebar as open when admin logs in
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const device = useDeviceDetection()

  // Ensure sidebar opens when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setSidebarOpen(true)
    }
  }, [isAuthenticated])

  return (
    <div className="h-screen flex overflow-hidden bg-secondary-50 dark:bg-secondary-900">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />
      
      {/* Main content area with smooth transition */}
      <motion.div 
        className="flex flex-col flex-1 overflow-hidden relative"
        animate={{
          marginLeft: device != 'Mobile'? sidebarOpen ? 288 : 0: 0, // 72 * 4 = 288px, 20 * 4 = 80px
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8
        }}
      >
 <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-white dark:bg-secondary-800">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>

      </motion.div>
       
      {/* </motion.div> */}
    </div>
  )
}
