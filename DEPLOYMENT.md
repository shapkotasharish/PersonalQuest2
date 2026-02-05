# Deployment Instructions

## Creating an Anonymous GitHub Pages URL

To keep your username hidden, follow these steps to deploy via a GitHub Organization:

### Step 1: Create a GitHub Organization

1. Go to https://github.com/organizations/plan
2. Click "Create a free organization"
3. Name it: `birthdaygirlnaava` (or any neutral name)
4. Skip adding members
5. Complete the setup

### Step 2: Create a Repository

1. Go to your new organization's page
2. Click "New repository"
3. Name it: `party` (or `birthday-party`)
4. Make it **Public**
5. Don't add README (we already have files)
6. Click "Create repository"

### Step 3: Push the Code

Run these commands in your terminal (from the NaavuBday folder):

```bash
git remote add origin https://github.com/birthdaygirlnaava/party.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository Settings
2. Click "Pages" in the sidebar
3. Under "Source", select "Deploy from a branch"
4. Select "main" branch and "/ (root)" folder
5. Click Save

### Step 5: Access Your Site!

Your site will be live at:
**https://birthdaygirlnaava.github.io/party/**

(Replace with your actual org name and repo name)

---

## Alternative: Using the gh CLI

If you have the GitHub CLI installed, you can do this faster:

```bash
# Create organization (must be done on web)
# Then:
gh repo create birthdaygirlnaava/party --public --source=. --remote=origin --push
gh api repos/birthdaygirlnaava/party/pages -X POST -f source='{"branch":"main","path":"/"}'
```

---

## Files Included

- `index.html` - Landing page
- `hub.html` - Game selection
- `clicker.html` - Party Power Clicker (main game)
- `cakes.html` - Catch the Falling Cakes
- `whack.html` - Whack-A-Thing
- `eggs.html` - Easter Egg Hunt tracker
- `chaos.html` - Chaos Mode
- `css/` - All stylesheets
- `js/` - All JavaScript files
