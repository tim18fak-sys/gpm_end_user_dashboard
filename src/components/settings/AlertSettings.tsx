
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  ServerIcon,
  UserIcon,
  AcademicCapIcon,
  BellAlertIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

interface AlertRule {
  id: string
  name: string
  description: string
  type: 'security' | 'system' | 'user' | 'university' | 'performance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  conditions: string[]
  actions: string[]
  icon: any
}

interface ActiveAlert {
  id: string
  title: string
  message: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  acknowledged: boolean
}

export default function AlertSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged'>('all')

  useEffect(() => {
    fetchAlertSettings()
  }, [])

  const fetchAlertSettings = async () => {
    try {
      const [rulesResponse, alertsResponse] = await Promise.all([
        api.get('/v1/settings/alerts/rules'),
        api.get('/v1/settings/alerts/active')
      ])
      setAlertRules(rulesResponse.data || [])
      setActiveAlerts(alertsResponse.data || [])
    } catch (error) {
      console.error('Failed to fetch alert settings:', error)
      // Mock data for when API is not available
      setAlertRules([
        {
          id: 'security-login',
          name: 'Failed Login Attempts',
          description: 'Alert when multiple failed login attempts are detected',
          type: 'security',
          severity: 'high',
          enabled: true,
          conditions: ['5+ failed attempts in 10 minutes'],
          actions: ['Email admin', 'Lock account'],
          icon: ShieldExclamationIcon
        },
        {
          id: 'system-disk',
          name: 'Disk Space Warning',
          description: 'Alert when disk space is running low',
          type: 'system',
          severity: 'medium',
          enabled: true,
          conditions: ['Disk usage > 85%'],
          actions: ['Email admin', 'Create notification'],
          icon: ServerIcon
        },
        {
          id: 'user-registration',
          name: 'Bulk User Registration',
          description: 'Alert when unusual number of users register',
          type: 'user',
          severity: 'medium',
          enabled: false,
          conditions: ['20+ registrations in 1 hour'],
          actions: ['Email admin'],
          icon: UserIcon
        },
        {
          id: 'university-status',
          name: 'University Status Change',
          description: 'Alert when university status changes',
          type: 'university',
          severity: 'low',
          enabled: true,
          conditions: ['Status changed to inactive/suspended'],
          actions: ['Email admin', 'Log event'],
          icon: AcademicCapIcon
        }
      ])
      
      setActiveAlerts([
        {
          id: '1',
          title: 'High CPU Usage Detected',
          message: 'Server CPU usage has exceeded 90% for the past 15 minutes',
          type: 'system',
          severity: 'high',
          timestamp: '2024-01-15T10:30:00Z',
          acknowledged: false
        },
        {
          id: '2',
          title: 'Failed Login Attempts',
          message: '7 failed login attempts detected from IP 192.168.1.100',
          type: 'security',
          severity: 'critical',
          timestamp: '2024-01-15T09:45:00Z',
          acknowledged: false
        },
        {
          id: '3',
          title: 'University Registration Spike',
          message: '25 new universities registered in the last hour',
          type: 'university',
          severity: 'medium',
          timestamp: '2024-01-15T08:20:00Z',
          acknowledged: true
        }
      ])
    } finally {
      setIsLoadingData(false)
    }
  }

  const toggleAlertRule = async (ruleId: string) => {
    setIsLoading(true)
    try {
      const updatedRules = alertRules.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
      setAlertRules(updatedRules)
      
      await api.patch(`/v1/settings/alerts/rules/${ruleId}`, {
        enabled: !alertRules.find(r => r.id === ruleId)?.enabled
      })
      
      toast.success('Alert rule updated!')
    } catch (error) {
      toast.error('Failed to update alert rule')
    } finally {
      setIsLoading(false)
    }
  }

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const updatedAlerts = activeAlerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
      setActiveAlerts(updatedAlerts)
      
      await api.patch(`/v1/settings/alerts/active/${alertId}/acknowledge`)
      toast.success('Alert acknowledged!')
    } catch (error) {
      toast.error('Failed to acknowledge alert')
    }
  }

  const dismissAlert = async (alertId: string) => {
    try {
      const updatedAlerts = activeAlerts.filter(alert => alert.id !== alertId)
      setActiveAlerts(updatedAlerts)
      
      await api.delete(`/v1/settings/alerts/active/${alertId}`)
      toast.success('Alert dismissed!')
    } catch (error) {
      toast.error('Failed to dismiss alert')
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800'
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800'
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800'
      default: return 'text-secondary-600 bg-secondary-100 border-secondary-200'
    }
  }

  const filteredAlerts = activeAlerts.filter(alert => {
    if (filter === 'active') return !alert.acknowledged
    if (filter === 'acknowledged') return alert.acknowledged
    return true
  })

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
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ExclamationTriangleIcon className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Loading Alert Settings
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              Configuring your alert preferences...
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
          Alert Settings
        </h3>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Configure alert rules and manage active alerts.
        </p>
      </div>

      {/* Active Alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-secondary-900 dark:text-white">
            Active Alerts ({activeAlerts.filter(a => !a.acknowledged).length})
          </h4>
          <div className="flex space-x-2">
            {['all', 'active', 'acknowledged'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filter === f
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-400 dark:hover:bg-secondary-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-secondary-50 dark:bg-secondary-800 rounded-xl"
          >
            <BellAlertIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
              No Alerts
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              {filter === 'active' ? 'No active alerts at the moment.' : 
               filter === 'acknowledged' ? 'No acknowledged alerts.' : 
               'All clear! No alerts to display.'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 rounded-xl border-l-4 ${getSeverityColor(alert.severity)} ${
                    alert.acknowledged ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-secondary-900 dark:text-white">
                          {alert.title}
                        </h5>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center text-xs text-secondary-500 space-x-2">
                        <ClockIcon className="h-4 w-4" />
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Alert Rules */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-secondary-900 dark:text-white">
          Alert Rules
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {alertRules.map((rule, index) => {
              const Icon = rule.icon
              return (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    rule.enabled
                      ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                      : 'border-secondary-200 bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        rule.enabled
                          ? 'bg-primary-100 dark:bg-primary-800'
                          : 'bg-secondary-100 dark:bg-secondary-700'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          rule.enabled
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-secondary-500 dark:text-secondary-400'
                        }`} />
                      </div>
                      <div>
                        <h5 className="font-medium text-secondary-900 dark:text-white">
                          {rule.name}
                        </h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(rule.severity)}`}>
                          {rule.severity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAlertRule(rule.id)}
                      disabled={isLoading}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        rule.enabled
                          ? 'bg-primary-600'
                          : 'bg-secondary-300 dark:bg-secondary-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          rule.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                    {rule.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h6 className="text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        Conditions
                      </h6>
                      <ul className="text-xs text-secondary-600 dark:text-secondary-400 space-y-1">
                        {rule.conditions.map((condition, idx) => (
                          <li key={idx} className="flex items-center space-x-1">
                            <span className="w-1 h-1 bg-secondary-400 rounded-full"></span>
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h6 className="text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        Actions
                      </h6>
                      <ul className="text-xs text-secondary-600 dark:text-secondary-400 space-y-1">
                        {rule.actions.map((action, idx) => (
                          <li key={idx} className="flex items-center space-x-1">
                            <span className="w-1 h-1 bg-secondary-400 rounded-full"></span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
