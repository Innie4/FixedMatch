# Facebook OAuth Setup

## Quick Setup Steps

### 1. Facebook Developer Portal
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app → Choose "Consumer"
3. Add "Facebook Login" product
4. Configure for "Web" platform

### 2. Configure OAuth Redirect URIs
Add these URLs in Facebook app settings:
- Development: `http://localhost:3000/api/auth/callback/facebook`
- Production: `https://yourdomain.com/api/auth/callback/facebook`

### 3. Get Credentials
In Facebook app settings → Basic:
- Copy **App ID** (Client ID)
- Copy **App Secret** (Client Secret)

### 4. Environment Variables
Create `.env.local` file with:
```env
FACEBOOK_CLIENT_ID="your-app-id"
FACEBOOK_CLIENT_SECRET="your-app-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
```

### 5. Test
- Run `npm run dev`
- Test Facebook login on your app

## Troubleshooting
- "Invalid OAuth redirect URI": Check URI spelling exactly
- "App not in development mode": Add test users or submit for review
- Configuration errors: Verify environment variables are set correctly 