# How to Push to GitHub (First Time)

## Option 1: Using Personal Access Token (Recommended for first-time users)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: "Webflow Project"
   - Check "repo" scope
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Push your code:**
   Run this command in your terminal:
   ```bash
   git push -u origin main
   ```
   
   When prompted:
   - **Username**: `offpisteagency` (or your GitHub username)
   - **Password**: Paste your Personal Access Token (not your GitHub password!)

## Option 2: Using GitHub Desktop (Easiest for beginners)

1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. File → Add Local Repository
4. Select your folder: `/Users/wissevellinga/Desktop/three-js_webflow`
5. Click "Publish repository" button
6. Done!

## Option 3: Using SSH (More advanced)

If you prefer SSH keys, you'll need to:
1. Generate an SSH key
2. Add it to your GitHub account
3. Change the remote URL to use SSH instead of HTTPS

