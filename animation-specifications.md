# 🎬 Animation Specifications - 過去問hub

## Overview
過去問hubにおけるアニメーション・インタラクション仕様書。Figmaプロトタイピングとコード実装の両方で活用。

---

## 🎯 Animation Principles

### Core Principles
1. **Purposeful**: すべてのアニメーションには明確な目的がある
2. **Subtle**: 過度に派手でなく、ユーザビリティを妨げない
3. **Fast**: レスポンシブな感覚を保つため高速実行
4. **Consistent**: 一貫したタイミングとイージング
5. **Accessible**: motion-reduce設定に対応

### Brand Personality in Motion
- **Modern & Clean**: シンプルで洗練されたアニメーション
- **Friendly**: 親しみやすいバウンシーな動き
- **Efficient**: スムーズで効率的なトランジション

---

## ⚡ Animation Tokens

### Duration Scale
```css
--duration-fast: 150ms     /* Immediate feedback */
--duration-normal: 200ms   /* Standard interactions */
--duration-slow: 300ms     /* Emphasized transitions */
--duration-slower: 500ms   /* Page transitions */
```

### Easing Functions
```css
--ease-out: cubic-bezier(0, 0, 0.58, 1)     /* Default for entrances */
--ease-in: cubic-bezier(0.42, 0, 1, 1)      /* For exits */
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1) /* For through transitions */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55) /* Playful interactions */
```

---

## 🎭 Component Animations

### 1. Button Interactions

#### Primary Button
**States**: Default → Hover → Active → Loading

**Hover Animation**:
```
Property: transform, box-shadow
Duration: 200ms
Easing: ease-out
Effect: translateY(-1px) + enhanced shadow
```

**Active Animation**:
```
Property: transform
Duration: 150ms  
Easing: ease-in-out
Effect: scale(0.95)
```

**Loading State**:
```
Property: transform (spin)
Duration: 1000ms
Easing: linear
Effect: rotate(360deg) infinite
Icon: spinner with rotation
```

**Figma Prototype**:
- Hover: After Delay 0ms → scale 1.02, shadow blur 20px
- Click: While Pressing → scale 0.95
- Loading: Component swap + auto-animate

### 2. Card Interactions

#### Thread Card
**Hover Animation**:
```
Property: transform, box-shadow
Duration: 300ms
Easing: ease-out
Effect: translateY(-4px) + shadow-2xl
Title Color: gray-900 → indigo-600
```

**Click Ripple** (Future Enhancement):
```
Property: scale, opacity
Duration: 600ms
Easing: ease-out
Effect: Radial expansion from click point
```

### 3. Navigation Animations

#### Logo Hover
```
Property: background-position
Duration: 200ms  
Easing: ease-in-out
Effect: Gradient shift (gray-900→indigo-600 to indigo-600→purple-600)
```

#### Back Button Icon
```
Property: transform
Duration: 200ms
Easing: ease-out
Effect: group-hover:translate-x(-4px)
```

### 4. Form Element Animations

#### Input Focus
```
Property: border-color, box-shadow
Duration: 200ms
Easing: ease-out
Effect: border-gray-200 → border-indigo-500 + ring-2
```

#### File Upload Hover
```
Property: border-color, background
Duration: 200ms
Easing: ease-in-out  
Effect: border-indigo-200 → border-indigo-300
```

---

## 🌟 Special Effects

### 1. Blob Background Animation
**Keyframes**:
```css
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
```

**Properties**:
- Duration: 7000ms
- Easing: ease-in-out
- Iteration: infinite
- Delay variations: 0ms, 2000ms, 4000ms

### 2. Gradient Text Animation (Future)
```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 3. Glassmorphism Entrance
```css
@keyframes glass-in {
  0% { 
    opacity: 0;
    backdrop-filter: blur(0px);
    transform: translateY(20px);
  }
  100% { 
    opacity: 1;
    backdrop-filter: blur(8px);
    transform: translateY(0px);
  }
}
```

---

## 📱 Page Transitions

### Route Transitions (Future)
1. **Fade In/Out**: Between similar pages
2. **Slide Left/Right**: Navigation hierarchy
3. **Scale Up/Down**: Modal-like interactions

---

## 🎮 Micro-interactions

### 1. Icon Animations
- **Arrow Right**: group-hover:translate-x-1
- **Arrow Left**: group-hover:translate-x(-1)  
- **Arrow Down**: group-hover:translate-y-1
- **Plus Icon**: hover:rotate-90
- **Heart Icon**: click:scale-110 + color change

### 2. Badge Interactions
- **Hover**: slight scale(1.05) + enhanced shadow
- **Click**: brief scale(0.95) feedback

### 3. Avatar Interactions  
- **Hover**: subtle scale(1.1) + shadow
- **Status Indicator**: pulse animation for online state

---

## 🎨 Figma Prototyping Guide

### Prototype Settings
```
Default Transition: Smart Animate
Duration: 200ms
Easing: Ease Out (default)
```

### Component States Setup
1. **Create Component Variants**
   - Default, Hover, Active, Loading, Disabled
   - Use Boolean properties for states

2. **Smart Animate Properties**
   - Position (for slides, lifts)
   - Size (for scales)  
   - Color (for state changes)
   - Shadow (for depth changes)

3. **Interaction Triggers**
   - Mouse Enter/Leave: Hover states
   - Mouse Down/Up: Active states  
   - While Pressing: Pressed states
   - After Delay: Loading states

### Advanced Prototyping
1. **Overlay Animations**
   - Modal entrances: Scale from 0.8 to 1.0
   - Dropdown menus: Slide down with fade
   
2. **Component Swapping**
   - Loading states with spinner components
   - Form validation with error states

3. **Auto-Animate Chains**
   - Multi-step form progress
   - Content state transitions

---

## 🔧 Implementation Examples

### CSS Implementation
```css
/* Button Hover */
.btn-primary {
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-xl);
}

/* Card Hover */
.card {
  transition: all var(--duration-slow) var(--easing-ease-out);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-2xl);
}
```

### React Framer Motion (Future)
```jsx
import { motion } from 'framer-motion'

const Button = ({ children, ...props }) => (
  <motion.button
    whileHover={{ y: -1, scale: 1.02 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    {...props}
  >
    {children}
  </motion.button>
)
```

---

## ♿ Accessibility Considerations

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Indicators
- Visible focus rings with color and animation
- Skip-to-content animations
- Screen reader friendly transitions

---

## 📊 Performance Guidelines

### Animation Performance
1. **Use transform and opacity** for smooth 60fps animations
2. **Avoid animating layout properties** (width, height, margin, padding)
3. **Use will-change** sparingly and clean up after animations
4. **Prefer CSS animations** over JavaScript for simple interactions

### Figma Performance
1. **Limit nested auto-animate layers** to 3-4 levels
2. **Use component instances** instead of groups for better performance
3. **Optimize complex gradients** and effects

---

## 🚀 Next Steps

### Phase 1: Core Animations ✅
- [x] Button interactions
- [x] Card hover effects  
- [x] Form focus states
- [x] Basic transitions

### Phase 2: Advanced Effects (In Progress)
- [ ] Page transitions
- [ ] Loading states
- [ ] Enhanced micro-interactions
- [ ] Gesture support

### Phase 3: Performance & Polish
- [ ] Motion accessibility
- [ ] Performance optimization  
- [ ] Animation system documentation
- [ ] A/B testing different timing values