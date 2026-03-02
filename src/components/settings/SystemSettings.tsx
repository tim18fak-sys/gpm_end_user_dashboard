
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ServerIcon,
  CpuChipIcon,
  CircleStackIcon,
  CloudIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

interface SystemInfo {
  serverStatus: 'healthy' | 'warning' | 'critical'
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  activeConnections: number
  uptime: string
  version: string
  lastBackup: string
}

interface SystemSettings {
  maintenanceMode: boolean
  backupEnabled: boolean
  loggingLevel: 'debug' | 'info' | 'warn' | 'error'
  maxConnections: number
  sessionTimeout: number
}

export default function SystemSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    serverStatus: 'healthy',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    activeConnections: 0,
    uptime: '0 days',
    version: '1.0.0',
    lastBackup: new Date().toISOString()
  })
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    backupEnabled: true,
    loggingLevel: 'info',
    maxConnections: 1000,
    sessionTimeout: 30
  })

  useEffect(() => {
    fetchSystemData()
    const interval = setInterval(fetchSystemData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSystemData = async () => {
    try {
      const [infoResponse, settingsResponse] = await Promise.all([
        api.get('/v1/settings/system/info'),
        api.get('/v1/settings/system')
      ])
      setSystemInfo(infoResponse.data || systemInfo)
      setSettings(settingsResponse.data || settings)
    } catch (error) {
      console.error('Failed to fetch system data:', error)
      // Mock data
      setSystemInfo({
        serverStatus: 'healthy',
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        diskUsage: Math.random() * 100,
        activeConnections: Math.floor(Math.random() * 500),
        uptime: '15 days, 3 hours',
        version: '1.2.3',
        lastBackup: new Date(Date.now() - 3600000).toISOString()
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const updateSetting = async (key: keyof SystemSettings, value: any) => {
    setIsLoading(true)
    try {
      const updatedSettings = { ...settings, [key]: value }
      setSettings(updatedSettings)
      
      await api.patch('/v1/settings/system', { [key]: value })
      toast.success('System setting updated!')
    } catch (error) {
      toast.error('Failed to update system setting')
    } finally {
      setIsLoading(false)
    }
  }

  const triggerBackup = async () => {
    setIsLoading(true)
    try {
      await api.post('/v1/settings/system/backup')
      toast.success('Backup initiated!')
      await fetchSystemData()
    } catch (error) {
      toast.error('Failed to trigger backup')
    } finally {
      setIsLoading(false)
    }
  }

  const restartServices = async () => {
    if (!confirm('Are you sure you want to restart system services? This may cause brief downtime.')) {
      return
    }
    
    setIsLoading(true)
    try {
      await api.post('/v1/settings/system/restart')
      toast.success('Services restart initiated!')
    } catch (error) {
      toast.error('Failed to restart services')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800'
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'critical': return 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800'
      default: return 'text-secondary-600 bg-secondary-100 border-secondary-200'
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage > 80) return 'bg-red-500'
    if (usage > 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ServerIcon className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Loading System Settings
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              Gathering system information...
            </p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
          System Settings
        </h3>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Monitor system health and configure system-wide settings.
        </p>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-md font-medium text-secondary-900 dark:text-white">
            System Status
          </h4>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(systemInfo.serverStatus)}`}>
            {systemInfo.serverStatus.toUpperCase()}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg inline-flex items-center justify-center mb-3">
              <CpuChipIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {systemInfo.cpuUsage.toFixed(1)}%
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">CPU Usage</p>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(systemInfo.cpuUsage)}`}
                  style={{ width: `${systemInfo.cpuUsage}%` }}
                />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg inline-flex items-center justify-center mb-3">
              <CircleStackIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {systemInfo.memoryUsage.toFixed(1)}%
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Memory Usage</p>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(systemInfo.memoryUsage)}`}
                  style={{ width: `${systemInfo.memoryUsage}%` }}
                />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg inline-flex items-center justify-center mb-3">
              <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {systemInfo.diskUsage.toFixed(1)}%
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Disk Usage</p>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(systemInfo.diskUsage)}`}
                  style={{ width: `${systemInfo.diskUsage}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-secondary-900 dark:text-white">
              {systemInfo.activeConnections}
            </p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400">Active Connections</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-secondary-900 dark:text-white">
              {systemInfo.uptime}
            </p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400">Uptime</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-secondary-900 dark:text-white">
              v{systemInfo.version}
            </p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400">Version</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-secondary-900 dark:text-white">
              {new Date(systemInfo.lastBackup).toLocaleDateString()}
            </p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400">Last Backup</p>
          </div>
        </div>
      </div>

      {/* System Configuration */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white mb-6">
          System Configuration
        </h4>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  Maintenance Mode
                </p>
                <p className="text-xs text-secondary-600 dark:text-secondary-400">
                  Put the system in maintenance mode
                </p>
              </div>
            </div>
            <button
              onClick={() => updateSetting('maintenanceMode', !settings.maintenanceMode)}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenanceMode
                  ? 'bg-orange-600'
                  : 'bg-secondary-300 dark:bg-secondary-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CloudIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  Automatic Backups
                </p>
                <p className="text-xs text-secondary-600 dark:text-secondary-400">
                  Enable automatic daily backups
                </p>
              </div>
            </div>
            <button
              onClick={() => updateSetting('backupEnabled', !settings.backupEnabled)}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.backupEnabled
                  ? 'bg-blue-600'
                  : 'bg-secondary-300 dark:bg-secondary-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.backupEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Logging Level
              </label>
              <select
                value={settings.loggingLevel}
                onChange={(e) => updateSetting('loggingLevel', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Max Connections
              </label>
              <input
                type="number"
                value={settings.maxConnections}
                onChange={(e) => updateSetting('maxConnections', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Session Timeout (min)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* System Actions */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white mb-6">
          System Actions
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={triggerBackup}
            disabled={isLoading}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <CloudIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <p className="font-medium text-secondary-900 dark:text-white">
                  Manual Backup
                </p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Create a backup now
                </p>
              </div>
            </div>
          </button>
          
          <button
            onClick={restartServices}
            disabled={isLoading}
            className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <ServerIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              <div className="text-left">
                <p className="font-medium text-secondary-900 dark:text-white">
                  Restart Services
                </p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Restart system services
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
