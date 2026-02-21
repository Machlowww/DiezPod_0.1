# Deploy DiezPod to Vercel

## 🚀 Quick Deploy Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

### 4. Update Google OAuth Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID: `150912343817-idgfluudlsk48hm84ntskqdkb1d1tstr.apps.googleusercontent.com`
3. Click "Edit"
4. Add your Vercel URL to:
   - Authorized JavaScript origins
   - Authorized redirect URIs

### 5. Test
Your app will work perfectly at your Vercel URL!

## 📋 Alternative: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## 🔧 What Happens
- ✅ HTTPS URL (required for OAuth)
- ✅ Public domain (allowed by Google)
- ✅ Real Google Calendar integration
- ✅ No localhost issues
