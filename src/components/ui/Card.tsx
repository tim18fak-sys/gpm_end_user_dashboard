import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline"
import { FC, } from "react"
import {motion} from 'framer-motion'

interface PrimaryCardInterface {
    name:string, 
    statsVariants: {

    },
    stat:string,
    description:string,
    Icon:any, 
    index:number
    changeType:string,
    change:string
}
export const PrimaryCard:FC<PrimaryCardInterface> =({name, statsVariants,stat, description,Icon,index, changeType, change}) => {
    return <motion.div
    key={name}
    variants={statsVariants}
    whileHover={{ 
      scale: 1.02, 
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative bg-white dark:bg-secondary-800 overflow-hidden shadow-lg rounded-2xl border border-secondary-200 dark:border-secondary-700 p-6 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg">
              <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">{name}</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mb-1">{stat}</p>
          <p className="text-xs text-secondary-500 dark:text-secondary-400">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "auto" }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        changeType === 'increase' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {changeType === 'increase' ? (
            <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
          )}
          {change}
        </motion.div>
      </div>
    </div>
  </motion.div>
}