# 🎨 Figma Design System Ready Package

## 📦 Package Contents

このフォルダには、過去問hubのFigmaデザインシステム構築に必要なすべてのファイルが含まれています。

### 📁 Files Included
1. **`design-tokens.json`** - Figma Variables用のデザイントークン定義
2. **`figma-component-specs.md`** - コンポーネント仕様書
3. **`src/styles/design-tokens.css`** - CSS Variables実装
4. **`animation-specifications.md`** - アニメーション・インタラクション仕様書
5. **`FIGMA-READY.md`** - このファイル（Figma作業ガイド）

---

## 🚀 Quick Start Guide

### Step 1: Figmaファイル作成
1. 新しいFigmaファイルを作成
2. ファイル名: `過去問hub Design System v1.0`
3. チーム: 適切なチームに配置

### Step 2: ページ構成
以下のページを作成してください:

```
📄 🏠 Cover & Overview
📄 🎨 Design Tokens  
📄 🧩 Components
📄 📱 Responsive System
📄 🎬 Animations & States
📄 🖼️ Page Templates
📄 🎯 Prototypes
```

### Step 3: Variables Setup (重要!)
`design-tokens.json`を参考に、以下のVariable Collectionsを作成:

#### Color Collections
- **Primary** (Indigo scale)
- **Secondary** (Purple scale)
- **Semantic** (Success, Warning, Error, Info)
- **Neutral** (Gray scale)

#### Typography Collections  
- **Font Family** (Primary, Mono)
- **Font Size** (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl)
- **Font Weight** (normal, medium, semibold, bold)
- **Line Height** (tight, normal, relaxed, loose)

#### Spacing Collection
- **Spacing** (0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24)

#### Effects Collections
- **Border Radius** (none, sm, base, md, lg, xl, 2xl, 3xl, full)
- **Shadows** (sm, base, md, lg, xl, 2xl)

---

## 🧩 Component Implementation Order

### Priority 1: Foundation Components
1. **Colors & Variables** - Variablesセットアップ
2. **Typography Styles** - Text stylesの定義
3. **Effect Styles** - Shadow/border radius styles

### Priority 2: Core Components
4. **Button** (Primary, Secondary, Icon variants)
5. **Input** (Text, Textarea, Select states)
6. **Card** (Thread, Comment, Feature variants)
7. **Badge** (University, Faculty, Course, Year)
8. **Avatar** (Small, Medium, Large sizes)

### Priority 3: Navigation & Layout
9. **Navigation Bar** (Desktop, Mobile responsive)
10. **Layout Grids** (Container widths, responsive grid)
11. **Page Headers** (Hero sections, breadcrumbs)

### Priority 4: Complex Components
12. **Thread Card** (Complete with all elements)
13. **Comment Card** (With avatar and interactions)
14. **Form Patterns** (Upload, Search, Filter)
15. **Empty States** (No results, error states)

---

## 🎨 Design Tokens Implementation

### Color Usage Guidelines
```
Primary (Indigo): Main brand color, CTAs, links
Secondary (Purple): Gradients, secondary actions  
Semantic: Success (green), Warning (yellow), Error (red), Info (blue)
Neutral: Text, backgrounds, borders
```

### Typography Hierarchy
```
Hero Title: 5xl-7xl, bold, gradient text
Page Title: 4xl-5xl, bold, gradient text  
Section Title: 3xl, bold
Card Title: xl, bold
Body Large: lg, normal
Body Default: base, normal
Label: sm, semibold
Badge/Caption: xs, medium
```

### Spacing Scale
```
Tight spacing: 1-3 (4px-12px)
Default spacing: 4-6 (16px-24px)  
Loose spacing: 8-12 (32px-48px)
Section spacing: 16-24 (64px-96px)
```

---

## 🎬 Animation & State Implementation

### Button States
- **Default**: Base appearance
- **Hover**: Lift (-1px) + enhanced shadow
- **Active**: Scale (0.95)  
- **Loading**: Spinner + disabled state
- **Disabled**: Reduced opacity + no interaction

### Card Interactions
- **Default**: Base card styling
- **Hover**: Lift (-4px) + shadow enhancement
- **Active**: Slight scale or press effect

### Form Element States  
- **Default**: Gray border
- **Focus**: Blue border + ring
- **Error**: Red border + error message
- **Success**: Green border + check icon

### Prototype Settings
```
Default Transition: Smart Animate
Duration: 200ms (normal), 150ms (fast), 300ms (slow)
Easing: Ease Out (most interactions)
```

---

## 📱 Responsive Implementation

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Container Widths
- **Narrow**: 768px (upload forms)
- **Wide**: 1024px (thread details)
- **Full**: 1280px (main content)

### Grid Systems
- **2-column**: 1 column mobile → 2 columns tablet+
- **3-column**: 1 column mobile → 3 columns desktop
- **4-column**: 2 columns mobile → 4 columns desktop

---

## 🎯 Component Specifications

### Brand Identity Elements
- **Logo**: "過去問hub" with gradient text treatment
- **Tagline**: "過去問を探せて、話せる"
- **Color Palette**: Indigo-Purple gradient system
- **Typography**: Clean, modern sans-serif

### Key Components Reference

#### Navigation Bar
```
Height: 64px
Background: white/90 + backdrop-blur
Logo: Gradient text (clickable)
Actions: Button components in flex layout
Mobile: Hamburger menu (auto-layout)
```

#### Thread Card
```
Layout: Auto-layout vertical
Padding: 32px
Border Radius: 16px  
Background: Glass effect (white/90 + blur)
Hover: Lift + shadow enhancement
```

#### Primary Button  
```
Background: Primary gradient
Text: White, semibold
Padding: 12px 32px
Border Radius: 12px
States: Default, Hover, Active, Loading, Disabled
```

---

## 🔧 Implementation Tips

### Auto Layout Best Practices
1. **Use Auto Layout everywhere** - Essential for responsive design
2. **Set proper constraints** - Fill/Hug content appropriately  
3. **Nested Auto Layouts** - Cards contain multiple auto-layout elements
4. **Spacing tokens** - Use consistent gap values

### Component Variants Setup
1. **Boolean Properties**: isLoading, isDisabled, isError
2. **Instance Swap**: Icons, avatars, content variations
3. **Text Properties**: Labels, content, placeholders
4. **Variant Properties**: Size, type, state combinations

### Naming Convention
```
Component/Variant/Property
Examples:
- Button/Primary/Default
- Card/Thread/Hover  
- Input/Text/Focus
- Badge/University/Default
```

---

## ✅ Completion Checklist

### Foundation Setup
- [ ] Variables collections created
- [ ] Color styles defined
- [ ] Text styles hierarchy  
- [ ] Effect styles (shadows, radius)

### Core Components
- [ ] Button (all variants + states)
- [ ] Input (all types + states)
- [ ] Card (all variants)
- [ ] Badge (all categories)
- [ ] Avatar (all sizes)

### Navigation & Layout  
- [ ] Navigation bar (responsive)
- [ ] Grid system components
- [ ] Container components

### Advanced Components
- [ ] Thread card (complete)
- [ ] Comment card (complete)  
- [ ] Form patterns
- [ ] Empty states

### Prototyping
- [ ] Button interactions
- [ ] Card hover effects
- [ ] Form state changes
- [ ] Navigation flows

---

## 🚀 Next Phase: Advanced Features

After completing the core design system:

1. **Dark Mode Support** - Duplicate variable collections
2. **Advanced Animations** - Complex state transitions
3. **Mobile-Specific Components** - Touch-optimized elements
4. **Accessibility Features** - Focus indicators, contrast checks
5. **Design Documentation** - Usage guidelines, do's and don'ts

---

## 📞 Support & Questions

このデザインシステム構築中に疑問や問題が発生した場合は：

1. `figma-component-specs.md` を再確認
2. `animation-specifications.md` でインタラクション詳細を確認
3. `design-tokens.json` で正確な値を確認
4. Gemini CLI に相談（プロンプト: "Figmaデザインシステムの[具体的な問題]について相談したい"）

---

**Happy Designing! 🎨✨**