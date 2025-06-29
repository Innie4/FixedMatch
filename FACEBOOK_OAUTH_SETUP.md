# Facebook OAuth Setup Guide

This guide will help you set up Facebook OAuth authentication for your Predicts application.

## Step 1: Facebook Developer Portal Setup

### 1.1 Access Facebook Developers Portal
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"Get Started"** or **"Log In"** if you already have an account
3. If you don't have a Facebook account, create one first

### 1.2 Create a New App
1. Once logged in, click **"Create App"** or **"My Apps"** → **"Create App"**
2. Choose the app type:
   - Select **"Consumer"** for most web applications
   - Or **"Business"** if it's for business purposes
3. Click **"Next"**

### 1.3 Configure Your App
1. **App Name**: Enter a name for your app (e.g., "Predicts - Football Predictions")
2. **App Contact Email**: Enter your email address
3. **App Purpose**: Select the appropriate category for your app
4. Click **"Create App"**

### 1.4 Add Facebook Login Product
1. On your app dashboard, you'll see a list of available products
2. Find **"Facebook Login"** in the product list
3. Click **"Set Up"** next to Facebook Login
4. Choose your platform:
   - Select **"Web"** for web applications
   - Click **"Next"**

### 1.5 Configure Facebook Login Settings
1. **Site URL**: Enter your website URL
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
2. Click **"Save"** and then **"Continue"**

### 1.6 Set Up OAuth Redirect URIs
1. In the Facebook Login settings, go to **"Settings"** → **"Basic"**
2. Scroll down to **"Valid OAuth Redirect URIs"**
3. Add your callback URL:
   - For development: `http://localhost:3000/api/auth/callback/facebook`
   - For production: `https://yourdomain.com/api/auth/callback/facebook`
4. Click **"Save Changes"**

### 1.7 Get Your App ID and App Secret
1. In your app dashboard, go to **"Settings"** → **"Basic"**
2. You'll find:
   - **App ID**: A long string of numbers (e.g., `123456789012345`)
   - **App Secret**: Click **"Show"** to reveal it (e.g., `abcdef123456789abcdef123456789ab`)
3. **Important**: Keep your App Secret secure and never expose it in client-side code

## Step 2: Environment Variables Setup

### 2.1 Create Environment File
1. Copy the `env.template` file to `.env.local`:
   ```bash
   cp env.template .env.local
   ```

### 2.2 Configure Facebook Credentials
In your `.env.local` file, update these values with your Facebook app credentials:

```env
# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-app-id-here"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret-here"
```

Replace:
- `your-facebook-app-id-here` with your actual Facebook App ID
- `your-facebook-app-secret-here` with your actual Facebook App Secret

### 2.3 Configure Other Required Variables
Make sure to also configure these essential variables:

```env
# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/predicts"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step 3: NextAuth.js Configuration

Your NextAuth.js configuration is already set up in `src/app/api/auth/[...nextauth]/route.ts` and includes Facebook Provider:

```typescript
FacebookProvider({
  clientId: process.env.FACEBOOK_CLIENT_ID as string,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
}),
```

## Step 4: Testing Your Setup

### 4.1 Development Testing
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to your login page
3. Click the Facebook login button
4. You should be redirected to Facebook for authentication
5. After successful authentication, you should be redirected back to your app

### 4.2 Troubleshooting Common Issues

#### "Invalid OAuth redirect URI" Error
- Double-check your redirect URI spelling in Facebook app settings
- Ensure the URI matches exactly: `http://localhost:3000/api/auth/callback/facebook`
- Make sure there are no extra spaces or characters

#### "App not in development mode" Error
- If you want to test with non-admin users, you need to submit your app for review
- For development, you can test with admin users or add test users in Facebook app settings

#### "Configuration error" in NextAuth
- Verify your environment variables are correctly set
- Check that `FACEBOOK_CLIENT_ID` and `FACEBOOK_CLIENT_SECRET` are not empty
- Ensure your `.env.local` file is in the project root directory

## Step 5: Production Considerations

### 5.1 App Review
If you plan to go live, you may need to submit your app for review:
1. Go to your Facebook app dashboard
2. Navigate to **"App Review"**
3. Submit your app for review with required information
4. Provide privacy policy and terms of service URLs

### 5.2 Domain Verification
1. In your app settings, add your production domain
2. Verify domain ownership through Facebook's verification process
3. Update your OAuth redirect URIs to include production URLs

### 5.3 Privacy Policy and Terms of Service
Ensure you have:
- A privacy policy that covers Facebook data usage
- Clear terms of service
- Proper data handling practices

### 5.4 Environment Variables for Production
Update your production environment variables:
```env
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## Security Best Practices

1. **Never commit `.env.local` to version control**
2. **Use different App IDs/Secrets for development and production**
3. **Regularly rotate your App Secret**
4. **Monitor your app's usage and permissions**
5. **Implement proper error handling for authentication failures**

## Additional Resources

- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [NextAuth.js Facebook Provider](https://next-auth.js.org/providers/facebook)
- [Facebook App Review Guidelines](https://developers.facebook.com/docs/app-review/)

## Support

If you encounter issues:
1. Check the Facebook Developer Console for error messages
2. Verify your environment variables are correctly set
3. Test with a fresh browser session
4. Check the NextAuth.js logs for detailed error information 