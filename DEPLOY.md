# Deployment Guide for Webflow

## Step 1: Push to GitHub

After creating your GitHub repository, run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** in the left sidebar
4. Under **Source**, select **main** branch
5. Click **Save**
6. Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

Wait a few minutes for GitHub to build your site.

## Step 3: Embed in Webflow

### Option A: Using Embed Element (Recommended)

1. In Webflow, add an **Embed** element to your page
2. Paste this code (replace with your GitHub Pages URL):

```html
<iframe 
    src="https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/" 
    style="width: 100%; height: 100vh; border: none; position: absolute; top: 0; left: 0;"
    frameborder="0"
></iframe>
```

3. Set the Embed element to:
   - **Position**: Absolute (if you want it as a background)
   - **Width**: 100%
   - **Height**: 100vh (or your desired height)

### Option B: Using Custom Code (Better Performance)

1. In Webflow, go to **Project Settings** → **Custom Code**
2. Add to **Footer Code**:

```html
<script>
  // Create container for Three.js animation
  const particleContainer = document.createElement('div');
  particleContainer.id = 'particle-canvas';
  particleContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none;';
  document.body.appendChild(particleContainer);
  
  // Load Three.js and your script
  const threeScript = document.createElement('script');
  threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  threeScript.onload = () => {
    const appScript = document.createElement('script');
    appScript.src = 'https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/script.js';
    document.body.appendChild(appScript);
  };
  document.body.appendChild(threeScript);
</script>
```

### Option C: Using Netlify (Alternative - Auto-deploy)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **Add new site** → **Import an existing project**
3. Connect your GitHub account and select your repository
4. Click **Deploy**
5. Your site will be live at: `https://YOUR_SITE_NAME.netlify.app`
6. Use this URL in the embed code above

## Tips for Webflow Integration

- **Z-index**: Set the animation container to `z-index: -1` if you want it as a background
- **Pointer Events**: Add `pointer-events: none` so clicks pass through
- **Responsive**: The animation already handles window resize
- **Performance**: Option B (Custom Code) is more performant than iframe


