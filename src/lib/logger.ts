import winston from 'winston'
import { performanceAnalytics } from './analytics'

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

// Add colors to Winston
winston.addColors(colors)

// Define the format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console(),
  // File transport for errors
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // File transport for all logs
  new winston.transports.File({ filename: 'logs/all.log' }),
]

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports,
})

// Create a stream object for Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim())
  },
}

// Export a function to log API requests
export const logApiRequest = (req: any, res: any, next: any) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`)
    performanceAnalytics.trackApiResponse(req.originalUrl, duration, res.statusCode)
  })
  next()
}

// Export a function to log errors
export const logError = (error: Error, context?: any) => {
  logger.error(error.message, { error, context })
  performanceAnalytics.trackError('application_error', error.message, context)
}

// Export a function to log package operations
export const logPackageOperation = (operation: string, packageId: number, details?: any) => {
  logger.info(`Package ${operation}: ${packageId}`, { packageId, details })
}

// Export a function to log user operations
export const logUserOperation = (operation: string, userId: number, details?: any) => {
  logger.info(`User ${operation}: ${userId}`, { userId, details })
}

// Export the logger instance
export default logger 