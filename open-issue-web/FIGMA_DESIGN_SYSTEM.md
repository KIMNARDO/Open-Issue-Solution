# Open Issue - Figma Design System Document

Figma Make 연동을 위한 UI/UX 디자인 시스템 문서입니다.

---

## 1. Design Tokens (디자인 토큰)

### 1.1 Color Palette (컬러 팔레트)

#### Primary Colors (Brand Blue)
| Token | Value | Usage |
|-------|-------|-------|
| `brand-50` | `rgba(239, 246, 255, 1)` | Background lightest |
| `brand-100` | `rgba(219, 234, 254, 1)` | Background light |
| `brand-200` | `rgba(191, 219, 254, 1)` | Hover states |
| `brand-300` | `rgba(147, 197, 253, 1)` | Selected light |
| `brand-400` | `rgba(96, 165, 250, 1)` | Links |
| `brand-500` | `rgba(59, 130, 246, 1)` | **Primary action** |
| `brand-600` | `rgba(37, 99, 235, 1)` | Hover primary |
| `brand-700` | `rgba(33, 82, 177, 1)` | Active state |
| `brand-800` | `rgba(23, 63, 145, 1)` | Dark variant |
| `brand-900` | `rgba(13, 37, 105, 1)` | Text on light |
| `brand-950` | `rgba(10, 25, 73, 1)` | Darkest |

#### Gray Scale (Light Mode)
| Token | Value | Usage |
|-------|-------|-------|
| `gray-50` | `rgba(250, 250, 250, 1)` | Page background |
| `gray-100` | `rgba(244, 244, 245, 1)` | Sidebar background |
| `gray-200` | `rgba(234, 234, 235, 1)` | Borders, dividers |
| `gray-300` | `rgba(213, 214, 215, 1)` | Disabled elements |
| `gray-400` | `rgba(166, 167, 171, 1)` | Placeholder text |
| `gray-500` | `rgba(125, 127, 130, 1)` | Secondary text |
| `gray-600` | `rgba(83, 86, 90, 1)` | Body text |
| `gray-700` | `rgba(64, 65, 69, 1)` | Primary text |
| `gray-800` | `rgba(44, 45, 48, 1)` | Headings |
| `gray-900` | `rgba(34, 35, 37, 1)` | High contrast text |

#### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `error-main` | `#E41B23` | Error states, validation |
| `error-lighter` | `#F6C2C2` | Error backgrounds |
| `success-main` | `#52c41a` (Ant Green) | Success states |
| `warning-main` | `#faad14` (Ant Gold) | Warning states |
| `info-main` | `#13c2c2` (Ant Cyan) | Info states |

#### Highlight Colors (for tags/badges)
| Color | Light Mode | Dark Mode |
|-------|------------|-----------|
| Yellow | `#fef9c3` | `#6b6524` |
| Green | `#dcfce7` | `#509568` |
| Blue | `#e0f2fe` | `#6e92aa` |
| Purple | `#f3e8ff` | `#583e74` |
| Red | `#ffe4e6` | `#743e42` |
| Gray | `rgb(248, 248, 247)` | `rgb(47, 47, 47)` |
| Orange | `rgb(251, 236, 221)` | `rgb(92, 59, 35)` |
| Pink | `rgb(252, 241, 246)` | `rgb(78, 44, 60)` |

---

### 1.2 Typography (타이포그래피)

#### Font Family
```
Primary: 'Pretendard Variable', 'Public Sans', sans-serif
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
```

#### Font Weights
| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Large display text |
| Regular | 400 | Body text |
| Medium | 500 | Emphasis |
| Semibold | 600 | Buttons, labels |
| Bold | 700 | Headings |

#### Type Scale (Medium - Default)
| Variant | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| h1 | 24px (1.5rem) | 700 | 1.3 | Large stats, hero headings |
| h2 | 18px (1.125rem) | 700 | 1.4 | Dialog titles, major sections |
| h3 | 16px (1rem) | 700 | 1.5 | Main titles, card headers |
| h4 | 14px (0.875rem) | 700 | 1.5 | Section subtitles, form labels |
| h5 | 13px (0.8125rem) | 600 | 1.5 | Sub headers |
| h6 | 11px (0.6875rem) | 700 | 1.5 | Table headers, small titles |
| subtitle1 | 12px (0.75rem) | 600 | 1.5 | Body text, form fields |
| subtitle2 | 11px (0.6875rem) | 500 | 1.5 | Secondary text, table cells |
| body1 | 13px (0.8125rem) | 500 | 1.6 | Main body text |
| body2 | 10px (0.625rem) | 500 | 1.6 | Small body text |
| caption | 8px (0.5rem) | 600 | 1.6 | Micro badges |
| button | 14px (0.875rem) | 600 | - | Button text |
| overline | 10px (0.625rem) | 600 | 1.6 | Overline text (UPPERCASE) |

---

### 1.3 Spacing & Layout

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-xxs` | 2px | Micro elements |
| `radius-xs` | 4px | Small buttons, chips |
| `radius-sm` | 6px | Default inputs |
| `radius-md` | 8px | Cards, containers |
| `radius-lg` | 12px | Large cards, modals |
| `radius-xl` | 16px | Feature cards |

#### Shadows
```css
/* Elevated Medium (Cards, Dropdowns) */
box-shadow:
  0px 16px 48px 0px rgba(17, 24, 39, 0.04),
  0px 12px 24px 0px rgba(17, 24, 39, 0.04),
  0px 6px 8px 0px rgba(17, 24, 39, 0.02),
  0px 2px 3px 0px rgba(17, 24, 39, 0.02);
```

#### Transitions
| Token | Duration | Easing |
|-------|----------|--------|
| Short | 0.1s | `cubic-bezier(0.46, 0.03, 0.52, 0.96)` |
| Default | 0.2s | `cubic-bezier(0.46, 0.03, 0.52, 0.96)` |
| Long | 0.64s | `cubic-bezier(0.46, 0.03, 0.52, 0.96)` |

---

## 2. Page Structure (화면 구조)

### 2.1 Main Pages

```
Open Issue System
├── Auth (인증)
│   └── Login (로그인)
│
├── QMS (품질관리)
│   └── Open Issue (오픈 이슈)
│       ├── DEPT View (부서별 보기)
│       ├── DEV View (개발팀 보기)
│       └── Create Issue (이슈 생성)
│
└── System (시스템 관리)
    ├── User Management (사용자 관리)
    ├── Authority Management (권한 관리)
    ├── Library Management (라이브러리 관리)
    ├── Code Library (코드 라이브러리)
    ├── Assessment Library (평가 라이브러리)
    ├── Calendar (캘린더)
    └── BBS (게시판)
```

### 2.2 Layout Structure

#### Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│  Header (56px)                                          │
│  [Logo] [Search] [FullScreen] [Lang] [Notif] [Profile] │
├───────────┬─────────────────────────────────────────────┤
│           │  StackBar (Tabs)                            │
│  Sidebar  ├─────────────────────────────────────────────┤
│  (240px)  │                                             │
│           │                                             │
│  - Menu   │           Main Content Area                 │
│  - NavList│                                             │
│           │                                             │
│           │                                             │
├───────────┴─────────────────────────────────────────────┤
│  Footer                                                  │
└─────────────────────────────────────────────────────────┘
```

#### Open Issue Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  SelectBox [Open Issue Type: DEPT/DEV]                  │
├───────────┬─────────────────────────────────────────────┤
│           │  Toolbar                                    │
│  NavList  │  [Search] [Filter] [Add] [Export]          │
│  (15vw)   ├─────────────────────────────────────────────┤
│  min:200px│                                             │
│           │           AG Grid Table                     │
│  - Team1  │                                             │
│    └ Cat1 │  - Issue List                               │
│    └ Cat2 │  - Columns: No, Category, Title, Manager    │
│  - Team2  │             Status, Importance, Date...     │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘
```

---

## 3. Components (컴포넌트)

### 3.1 Core Components

#### Buttons
| Type | Variant | Usage |
|------|---------|-------|
| CommonButton | Primary | Main actions (저장, 확인) |
| CommonButton | Secondary | Secondary actions (취소) |
| CommonButton | Outlined | Tertiary actions |
| IconButton | - | Icon-only actions |
| LoadingButton | - | Async operations |
| DateSelectButton | - | Date quick selection |

#### Form Inputs
| Component | Usage |
|-----------|-------|
| FormInput | Text input with label |
| SearchInput | Search with icon |
| ButtonInput | Input + button combo |
| PopoverInput | Input with popover selector |
| UserSearchInput | User search autocomplete |
| KeywordInput | Tag/keyword input |
| TableInput | Inline table editing |

#### Select/Dropdown
| Component | Usage |
|-----------|-------|
| SelectBox | Standard dropdown |
| FormSelect | Form-integrated select |
| BasicSelect | Simple select |
| ComboSelect | Searchable combo |
| BasicComboBox | Autocomplete combo |
| EditableCombo | Editable autocomplete |

#### Date Pickers
| Component | Usage |
|-----------|-------|
| BasicDatePicker | Single date selection |
| FormDatePicker | Form-integrated date |
| FormDateRangePicker | Date range selection |
| StaticCalendar | Inline calendar display |

### 3.2 Layout Components

| Component | Usage |
|-----------|-------|
| MainCard | Main content card wrapper |
| FormLayout | Form section container |
| FormContainer | Form field container |
| WrapContainer | Generic wrapper |
| SearchBar | Search filter bar |
| SearchBarFrame | Search bar container |

### 3.3 Data Display

| Component | Usage |
|-----------|-------|
| CommonGrid | AG Grid wrapper |
| SimpleGrid | Simple grid display |
| JsonGrid | JSON data grid |
| NavList | Navigation list (tree) |
| DetailNav | Detail navigation |
| FileList | File attachment list |
| OrgChart | Organization chart |

### 3.4 Feedback Components

| Component | Usage |
|-----------|-------|
| CommonConfirm | Confirmation dialog |
| BasicDialog | Generic dialog |
| SearchDialog | Search modal |
| Loader | Full page loader |
| CircularLoader | Inline loader |
| Snackbar | Toast notifications |
| Tooltip | Hover tooltips |

### 3.5 AG Grid Cell Renderers
| Renderer | Usage |
|----------|-------|
| DirectButton | Button in cell |
| DirectCheckbox | Checkbox in cell |
| DirectDatePicker | Date picker in cell |
| DirectSwitch | Toggle switch in cell |
| GridChipRenderer | Chip/tag in cell |
| LinkRenderer | Clickable link |
| ProgressbarRenderer | Progress bar |
| MultilineRenderer | Multi-line text |
| NumberFormatRenderer | Formatted numbers |
| ThumbnailRenderer | Image thumbnail |
| UserSearchRenderer | User search in cell |

---

## 4. Page Specifications (화면 명세)

### 4.1 Login Page

**URL**: `/login`

**Components**:
- AuthWrapper (centered layout)
- AuthCard (form container)
- FormInput x2 (ID, Password)
- Checkbox (Remember me)
- CommonButton (Login)
- Logo component

**Layout**: Centered card, gradient background

---

### 4.2 Open Issue Main Page

**URL**: `/qms/open-issue`

**Mode**: READ (List View)

**Left Panel (15vw, min 200px)**:
- SelectBox: Issue Type (DEPT/DEV)
- NavList: Team/Category tree
  - Expandable groups
  - Context menu (상세정보, 추가, 삭제)

**Right Panel (Main Content)**:
- **DEPT View**: DeptTable
- **DEV View**: DevTable

**Common Features**:
- AG Grid with columns:
  - Issue No, Category, Title
  - Manager, Status, Importance
  - Start Date, End Date, Duration
  - Progress, Remarks

**Actions**:
- Context menu for category management
- Issue creation button
- Export functionality

---

### 4.3 Create Issue Page

**URL**: `/qms/open-issue/create`

**Mode**: WRITE (Form View)

**Toolbar**:
- Save, Cancel buttons
- Breadcrumb

**MainForm Sections**:
1. **Basic Info**
   - Issue Type, Category
   - Title, Description

2. **Assignment**
   - Manager selection (UserSearchInput)
   - Team assignment

3. **Schedule**
   - Start Date, End Date
   - Duration (calculated)

4. **Details**
   - Importance (하/중/상/지시사항/긴급)
   - Status
   - Remarks

5. **Attachments**
   - File upload area

---

### 4.4 Issue Category Dialog

**Type**: Modal Dialog

**Tabs**:
1. Basic Info
2. Members
3. Categories

**Actions**: Save, Cancel, Delete

---

## 5. Importance Levels (중요도)

| Level | Label | Color Suggestion |
|-------|-------|------------------|
| 1 | 하 (Low) | Gray |
| 2 | 중 (Medium) | Blue |
| 3 | 상 (High) | Orange |
| 4 | 지시사항 (Directive) | Purple |
| 5 | 긴급 (Urgent) | Red |

---

## 6. Status States

| Status | Label | Color |
|--------|-------|-------|
| OPEN | 진행중 | Blue |
| CLOSED | 완료 | Green |
| DELAYED | 지연 | Red |
| PENDING | 대기 | Gray |

---

## 7. Icons

**Library**: FontAwesome (free-solid-svg-icons)

**Common Icons**:
- `faPlus` - Add
- `faTrash` - Delete
- `faInfoCircle` - Info
- `faEdit` - Edit
- `faSave` - Save
- `faSearch` - Search
- `faFilter` - Filter
- `faDownload` - Export
- `faUpload` - Upload
- `faCalendar` - Date
- `faUser` - User
- `faFolder` - Category
- `faFile` - File
- `faComment` - Comment

---

## 8. Figma Frame Recommendations

### Required Frames
1. **Design Tokens**
   - Color Swatches
   - Typography Samples
   - Spacing Grid
   - Icon Set

2. **Components Library**
   - Buttons (all states)
   - Inputs (all types)
   - Select/Dropdowns
   - Cards
   - Dialogs
   - Tables/Grids

3. **Page Templates**
   - Login
   - Dashboard Layout
   - List View (Open Issue)
   - Form View (Create Issue)
   - Dialog Examples

4. **Interactive Prototypes**
   - Login Flow
   - Issue CRUD Flow
   - Navigation Flow

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| xs | 0-600px | Mobile: Sidebar hidden, Stack layout |
| sm | 600-900px | Tablet: Collapsed sidebar |
| md | 900-1200px | Desktop: Standard layout |
| lg | 1200-1536px | Large: Extended sidebar |
| xl | 1536px+ | Extra large: Maximum content width |

---

## 10. Theme Support

### Light Mode (Default)
- Background: `#ffffff`
- Text: `#444444`
- Sidebar: `rgba(244, 244, 245, 1)`

### Dark Mode
- Background: `rgba(14, 14, 17, 1)`
- Text: `rgba(245, 245, 245, 1)`
- Sidebar: `rgba(32, 32, 34, 1)`

---

*Document Version: 1.0*
*Generated for Figma Make integration*
*Last Updated: 2026-02-05*
