# 🎉 Birthday Party Website – Complete Spec.md

> **Project Name:** Party Power Birthday Site  
> **Audience:** 9-year-old child  
> **Tone:** Magical, playful, cozy, never overwhelming  
> **Core Rule:** Everything is interactive, friendly, and rewarding

---

## 🔐 IMPORTANT ANONYMITY & REPO RULES (CRITICAL)

- **GitHub repository name MUST NOT include any personal name or username**
- Use a neutral repo name such as:
  - `party-power-birthday-site`
  - `birthday-party-game`
- All links must be generic
- No credits, no author names, no metadata identifying the creator

---

## 🌈 GLOBAL DESIGN SYSTEM

### 🎨 Color Palette
- Primary Gradient: Purple → Pink → Blue
- Accent Colors:
  - Soft yellow (sparkles)
  - White (text)
  - Pastel teal (highlights)

### ✍️ Fonts
- Headings: Rounded, bubbly display font
- Body: Clean, readable sans-serif
- Large text, generous spacing

### 🧭 UX PRINCIPLES
- One main action per screen
- No walls of text
- Clear feedback for every interaction
- Animations are slow, looping, and calming

---

## 🔊 GLOBAL AUDIO SYSTEM

### Rules
- Audio starts only after first user interaction
- Always-visible mute/unmute icon
- Volume low by default
- Audio preference saved locally

### Audio Types
- Hover: soft chime
- Click: gentle pop
- Unlock: sparkle sound
- Error: soft playful "oops" (never harsh)

### Background Music
- Instrumental only, no lyrics
- Different tracks per section:
  - Landing Page: magical & calm
  - Game Hub: playful
  - Clicker Game: upbeat but soft

---

## 🏠 LANDING PAGE

### Text (LOCKED COPY)

**Main Heading:**
> Happy Birthday Naavya! 🎂

**Subheading:**
> Level 9 unlocked! 🚀🎈

---

### Layout
- Centered heading and subheading
- One button only

### Button
> 🎮 Play Games

- Pulse animation
- Hover glow + soft whoosh
- Click triggers confetti wipe transition

---

### Interactive Elements

#### 🎈 Balloons
- Float upward
- Hover: wiggle
- Click: pop + confetti + sound
- Respawn after delay

#### 🐶🐼 Peek-a-Boo Characters
- Puppies and red pandas peek from edges
- Hover: wave
- Click: giggle + hide

#### ✨ Cursor Sparkle Trail
- Light sparkle following cursor
- Fades quickly

#### 🖐 Press & Hold Interaction
- Hold anywhere ~2s:
  - Screen glow
  - Confetti rain
  - Magical chime

---

## 🎮 GAME HUB PAGE

### Header
> 🎉 Choose a Game

### Game Cards

1. 🎂 **Party Power Clicker**
   - Main long-term game

2. 🌪 **Surprise Mode (Chaos Mode)**
   - Silly, fast, colorful

3. 🥚 **Easter Egg Hunt**
   - Eggs hidden across entire site

4. 🍰 **Catch the Falling Cakes**
   - Arcade, high-score based

5. 🎯 **Birthday Whack-A-Thing**
   - Reflex game with 3 lives

### Navigation
- Back button to Landing Page

---

## 🎂 PARTY POWER CLICKER (CORE GAME)

### Currency
- **Party Power**
- Click = +1
- Hold = continuous gain

### Main Scene Layout
```
[Decorations] [Dance Floor] [Main Cake] [Helpers Area]
```

---

### Visual Feedback
- Click sparkles
- Floating numbers
- Gentle sound per interaction

---

### Helpers (Visually Present)

#### 🐶 Puppy Helper
- Animation: hopping
- Effect: +1/sec

#### 🐼 Red Panda Helper
- Animation: waddling with balloons
- Effect: +5/sec

#### 🍫 Dubai Chocolate Panda
- Rare
- Animation: unwraps chocolate + sparkles
- Effect: +10% global boost

Rules:
- Helpers appear physically in scene
- Idle looping animations
- Never overcrowd

---

### Upgrades

- Only 3–4 visible at once
- Categories via tabs:
  - Clicking Power
  - Helpers
  - Decorations
  - Special Boosts

Each upgrade:
- One sentence description
- Clear numerical effect

---

### Themes & Styles (Unlockable)
- Night Party 🌙
- Neon Dance Floor 💜
- Puppy Pajama Party 💤
- Red Panda Festival 🎋

Unlock triggers:
- Confetti
- "NEW PARTY STYLE!" banner

---

### 🔁 Rebirth System

**Name:** Ultimate Party Rebirth

- Resets progress
- Grants **Party Stars ⭐**
- Party Stars permanently boost gain

Confirmation popup required.

---

## 🍰 CATCH THE FALLING CAKES

- Cakes fall from top
- Catch with mouse/finger
- Speed increases over time

Rules:
- Miss 3 cakes = game over
- High score saved locally

---

## 🎯 BIRTHDAY WHACK-A-THING

- Good targets: puppies, red pandas
- Bad targets: silly objects

Rules:
- Click bad OR miss good = lose life
- 3 lives total
- High score saved

---

## 🥚 EASTER EGG HUNT

- Eggs hidden across all pages
- Hint system included

Completion reward:
- Celebration animation + sound

---

## 🌪 CHAOS MODE

- Faster animations
- Color shifts
- Goofy sounds
- No scoring pressure

---

## 🔄 GLOBAL RESET (HIDDEN)

### Location
- Tiny 🎁 icon in corner on every page

### Behavior
- Click → confirmation popup
- Must confirm twice

Resets:
- All games
- All scores
- Clicker progress
- Eggs found

---

## 🎉 PARTY SCENE ANIMATION RULES

- Slow looping animations
- No flashing
- No screen shake

Examples:
- Balloons float & respawn
- Puppies wag tails
- Red pandas sway
- Helpers bounce on entry

---

## ✅ PERFORMANCE REQUIREMENTS

- Target: 60 FPS
- No lag on animations
- Disable effects automatically on low-performance devices

---

## 🧠 FINAL NOTE

This site should feel like:
- A surprise
- A playground
- A celebration

Every interaction should say: *"You did something fun."*

