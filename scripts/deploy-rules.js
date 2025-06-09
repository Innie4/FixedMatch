const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Check if rules file exists
const rulesPath = path.join(__dirname, '..', 'firestore.rules')
if (!fs.existsSync(rulesPath)) {
  console.error('Error: firestore.rules file not found!')
  process.exit(1)
}

console.log('Deploying Firestore security rules...')

try {
  // Deploy rules
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' })
  console.log('Firestore rules deployed successfully!')
} catch (error) {
  console.error('Error deploying Firestore rules:', error.message)
  process.exit(1)
}
