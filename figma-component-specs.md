# 過去問hub Figma Component Specifications

## 🎯 Overview
このドキュメントは、過去問hubの現在実装されているUIコンポーネントを基に、Figmaでデザインシステムを構築するためのコンポーネント仕様書です。

## 🎨 Brand Identity
- **ブランド名**: 過去問hub
- **コンセプト**: 大学生の学習コミュニティプラットフォーム
- **キーワード**: モダン、親しみやすい、信頼できる、効率的

---

## 🧩 Core Components

### 1. Navigation Bar
**Purpose**: サイト全体のナビゲーション

**Variants**:
- Default State
- Mobile State (要実装)

**Properties**:
```
Background: white/90 with backdrop-blur
Border: bottom border (gray-200)
Shadow: lg shadow
Height: 64px (h-16)
Logo: Gradient text (gray-900 to indigo-600)
Logo Hover: indigo-600 to purple-600
```

**Figma Structure**:
```
🔘 Navigation
  └── Container (max-w-7xl, mx-auto, px-4-8)
      ├── Logo (text with gradient)
      └── Actions (flex gap-4)
          └── Button/Link components
```

### 2. Buttons
**Purpose**: 主要アクション用のインタラクティブ要素

**Variants**:
- **Primary**: Gradient background, white text
- **Secondary**: White background, colored border
- **Icon Button**: Icon with hover animations

**Primary Button Properties**:
```
Background: gradient (indigo-600 to purple-600)
Text: white, font-semibold
Padding: py-3 px-8 (12px 32px)
Border Radius: rounded-xl (12px)
Hover: darker gradient, translate-y-0.5, shadow-xl
```

**States**: Default, Hover, Active, Loading, Disabled

**Figma Variants**:
- Size: Small, Medium, Large
- Type: Primary, Secondary, Icon
- State: Default, Hover, Disabled, Loading

### 3. Cards
**Purpose**: コンテンツグループ化とレイアウト

**Types**:
- **Thread Card**: スレッド一覧用
- **Comment Card**: コメント表示用  
- **Feature Card**: 機能紹介用
- **Upload Card**: ファイルアップロード用

**Thread Card Properties**:
```
Background: white/90 with backdrop-blur
Border: 1px solid gray-100
Border Radius: rounded-2xl (16px)
Padding: p-8 (32px)
Shadow: lg, hover:2xl
Hover: translate-y-1, shadow-2xl
```

**Figma Structure**:
```
🔘 Thread Card
  ├── Badges Row (flex gap-3)
  │   └── Badge components
  ├── Title (text-xl font-bold)
  ├── Content (text-gray-600, line-clamp-2)
  └── Footer (flex justify-between)
      ├── Author Info (flex gap-2)
      └── Actions (flex gap-3)
```

### 4. Badges
**Purpose**: カテゴリやステータス表示

**Variants**:
- University (blue gradient)
- Faculty (green gradient)  
- Course (purple gradient)
- Year (orange gradient)

**Properties**:
```
Background: gradient (color-500 to color-600)
Text: white, text-sm, font-medium
Padding: px-4 py-2 (16px 8px)
Border Radius: rounded-full
```

### 5. Form Elements

#### Input Field
**Properties**:
```
Background: white
Border: 2px solid gray-200
Border Radius: rounded-xl (12px)
Padding: p-4 (16px)
Focus: ring-2 ring-indigo-500, border-transparent
Hover: border-indigo-200
```

**States**: Default, Focus, Error, Disabled

#### Textarea
**Properties**: Same as Input Field
```
Resize: none
Rows: configurable (4, 6, 8)
```

#### File Upload
**Properties**:
```
Background: gradient (indigo-50 to purple-50)
Border: 2px dashed indigo-200
Border Radius: rounded-2xl (16px)
Padding: p-8 (32px)
Hover: border-indigo-300
```

### 6. Avatar
**Purpose**: ユーザー表示

**Variants**:
- Small (w-8 h-8)
- Medium (w-10 h-10)  
- Large (w-12 h-12)

**Properties**:
```
Background: gradient (indigo-500 to purple-500)
Border Radius: rounded-full
Text: white, font-bold, centered
```

---

## 🎨 Visual Patterns

### Glassmorphism Effect
現在のデザインで使用されているガラス効果:
```css
background: rgba(255, 255, 255, 0.9);
backdrop-filter: blur(8px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Gradient Usage
- **Text Gradients**: Hero titles, logos
- **Background Gradients**: Buttons, badges, avatars
- **Page Backgrounds**: Subtle gradients with animated blobs

### Animation Patterns
- **Hover Lift**: -translate-y-0.5 または -translate-y-1
- **Button Press**: active:scale-95
- **Icon Slide**: group-hover:translate-x-1
- **Loading Spin**: animate-spin

---

## 📱 Responsive Behavior

### Breakpoints (from design-tokens.json)
- **sm**: 640px
- **md**: 768px  
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Container Widths
- **Narrow**: max-w-3xl (upload page)
- **Wide**: max-w-4xl (thread detail)  
- **Full**: max-w-7xl (threads, navigation)

### Grid Systems
- **2 Column**: grid-cols-1 md:grid-cols-2
- **3 Column**: grid-cols-1 md:grid-cols-3
- **4 Column**: grid-cols-2 md:grid-cols-4

---

## 🎭 Figma Organization Structure

### Recommended Page Structure
```
📄 Cover (ブランドストーリー、概要)
📄 🎨 Design Tokens (カラー、タイポグラフィ、スペーシング)
📄 🧩 Components (すべてのコンポーネント)
📄 📱 Responsive Grid (レイアウトシステム)
📄 🎬 Animations (アニメーション仕様)
📄 🖼️ Templates (ページテンプレート)
📄 🎯 Prototypes (インタラクションデモ)
```

### Component Organization
```
🗂️ Foundations
  ├── Colors
  ├── Typography  
  ├── Icons
  └── Effects

🗂️ Components
  ├── Buttons
  ├── Cards
  ├── Forms
  ├── Navigation
  └── Data Display

🗂️ Patterns
  ├── Page Headers
  ├── Content Sections
  └── Layouts

🗂️ Templates
  ├── Landing Page
  ├── Threads List
  ├── Thread Detail
  └── Upload Form
```

---

## 🚀 Implementation Priority

### Phase 1: Core System
1. ✅ Design Tokens Setup
2. 🔄 Basic Components (Buttons, Cards, Forms)
3. ⏳ Navigation System

### Phase 2: Advanced Components  
1. ⏳ Complex Cards (Thread, Comment)
2. ⏳ Form Patterns (Upload, Search)
3. ⏳ Data Display (Lists, Tables)

### Phase 3: Templates & Prototypes
1. ⏳ Page Templates
2. ⏳ Responsive Layouts
3. ⏳ Interactive Prototypes

---

## 📝 Notes for Figma Implementation

### Auto Layout Usage
- すべてのコンポーネントでAuto Layoutを活用
- Responsive behaviorのためのConstraints設定
- Flexible padding/marginの設定

### Variants & Properties  
- Component Variantsでstate management
- Boolean propertiesでon/off states
- Text propertiesでcontent override

### Effects & Styles
- Color Stylesでブランドカラー管理
- Text Stylesでtypography hierarchy
- Effect Stylesでshadows and blur effects

### Naming Convention
```
Component/Variant/State
例: Button/Primary/Default
例: Card/Thread/Hover
例: Input/Text/Focus
```