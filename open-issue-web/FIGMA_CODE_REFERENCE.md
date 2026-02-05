# Open Issue - Figma Code Reference

Figma Make 연동을 위한 실제 코드 파일 참조 문서입니다.

---

## 1. Theme Configuration (테마 설정)

### 1.1 Color Palette (`src/themes/palette.ts`)

```typescript
// Gray Scale 정의
let greyPrimary = [
  '#ffffff',  // 0
  '#fafafa',  // 1
  '#f5f5f5',  // 2
  '#f0f0f0',  // 3
  '#d9d9d9',  // 4
  '#bfbfbf',  // 5
  '#999999',  // 6
  '#595959',  // 7
  '#262626',  // 8
  '#141414',  // 9
  '#000000'   // 10
];

// Theme Palette
palette: {
  mode,
  common: {
    black: '#000',
    white: '#fff'
  },
  text: {
    primary: '#444',
    secondary: paletteColor.grey[500],
    disabled: paletteColor.grey[500]
  },
  background: {
    paper: paletteColor.grey[0],
    default: paletteColor.grey.A50
  },
  error: {
    main: '#E41B23',
    lighter: '#F6C2C2'
  },
  divider: paletteColor.grey[300]
}
```

### 1.2 Typography (`src/themes/typography/md.ts`)

```typescript
const getMediumTypo = (typoColor: string): TypographyVariantsOptions => ({
  // Headings
  h1: {
    fontSize: '1.5rem',      // 24px
    fontWeight: 700,
    lineHeight: 1.3,
    color: typoColor
  },
  h2: {
    fontSize: '1.125rem',    // 18px
    fontWeight: 700,
    lineHeight: 1.4,
    color: typoColor
  },
  h3: {
    fontSize: '1rem',        // 16px
    fontWeight: 700,
    lineHeight: 1.5,
    color: typoColor
  },
  h4: {
    fontSize: '0.875rem',    // 14px
    fontWeight: 700,
    lineHeight: 1.5,
    color: typoColor
  },
  h5: {
    fontSize: '0.8125rem',   // 13px
    fontWeight: 600,
    lineHeight: 1.5,
    color: typoColor
  },
  h6: {
    fontSize: '0.6875rem',   // 11px
    fontWeight: 700,
    lineHeight: 1.5,
    color: typoColor
  },

  // Subtitles
  subtitle1: {
    fontSize: '0.75rem',     // 12px
    fontWeight: 600,
    lineHeight: 1.5,
    color: typoColor
  },
  subtitle2: {
    fontSize: '0.6875rem',   // 11px
    fontWeight: 500,
    lineHeight: 1.5,
    color: typoColor
  },

  // Body
  body1: {
    fontSize: '0.8125rem',   // 13px
    fontWeight: 500,
    lineHeight: 1.6,
    color: typoColor
  },
  body2: {
    fontSize: '0.625rem',    // 10px
    fontWeight: 500,
    lineHeight: 1.6,
    color: typoColor
  },

  // Special
  caption: {
    fontSize: '0.5rem',      // 8px
    fontWeight: 600,
    lineHeight: 1.6,
    color: typoColor
  },
  button: {
    fontSize: '0.875rem',    // 14px
    fontWeight: 600,
    textTransform: 'none',
    color: typoColor
  }
});
```

### 1.3 Shadows (`src/themes/shadows.tsx`)

```typescript
const CustomShadows = (theme: Theme): CustomShadowProps => ({
  button: `0 2px #0000000b`,
  text: `0 -1px 0 rgb(0 0 0 / 12%)`,
  z1: `0px 1px 4px ${alpha(theme.palette.grey[900], 0.08)}`,

  // Focus rings
  primary: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
  secondary: `0 0 0 2px ${alpha(theme.palette.secondary.main, 0.2)}`,
  error: `0 0 0 2px ${alpha(theme.palette.error.main, 0.2)}`,
  warning: `0 0 0 2px ${alpha(theme.palette.warning.main, 0.2)}`,
  info: `0 0 0 2px ${alpha(theme.palette.info.main, 0.2)}`,
  success: `0 0 0 2px ${alpha(theme.palette.success.main, 0.2)}`,

  // Button shadows
  primaryButton: `0 14px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  secondaryButton: `0 14px 12px ${alpha(theme.palette.secondary.main, 0.2)}`,
  errorButton: `0 14px 12px ${alpha(theme.palette.error.main, 0.2)}`
});
```

### 1.4 CSS Variables (`src/styles/_variables.scss`)

```scss
:root {
  /* Brand Colors (Blue) */
  --tt-brand-color-950: rgba(10, 25, 73, 1);
  --tt-brand-color-900: rgba(13, 37, 105, 1);
  --tt-brand-color-800: rgba(23, 63, 145, 1);
  --tt-brand-color-700: rgba(33, 82, 177, 1);
  --tt-brand-color-600: rgba(37, 99, 235, 1);
  --tt-brand-color-500: rgba(59, 130, 246, 1);   /* Primary */
  --tt-brand-color-400: rgba(96, 165, 250, 1);
  --tt-brand-color-300: rgba(147, 197, 253, 1);
  --tt-brand-color-200: rgba(191, 219, 254, 1);
  --tt-brand-color-100: rgba(219, 234, 254, 1);
  --tt-brand-color-50: rgba(239, 246, 255, 1);

  /* Gray (Light Mode) */
  --tt-gray-light-50: rgba(250, 250, 250, 1);
  --tt-gray-light-100: rgba(244, 244, 245, 1);
  --tt-gray-light-200: rgba(234, 234, 235, 1);
  --tt-gray-light-300: rgba(213, 214, 215, 1);
  --tt-gray-light-400: rgba(166, 167, 171, 1);
  --tt-gray-light-500: rgba(125, 127, 130, 1);
  --tt-gray-light-600: rgba(83, 86, 90, 1);
  --tt-gray-light-700: rgba(64, 65, 69, 1);
  --tt-gray-light-800: rgba(44, 45, 48, 1);
  --tt-gray-light-900: rgba(34, 35, 37, 1);

  /* Border Radius */
  --tt-radius-xxs: 0.125rem;  /* 2px */
  --tt-radius-xs: 0.25rem;    /* 4px */
  --tt-radius-sm: 0.375rem;   /* 6px */
  --tt-radius-md: 0.5rem;     /* 8px */
  --tt-radius-lg: 0.75rem;    /* 12px */
  --tt-radius-xl: 1rem;       /* 16px */

  /* Transitions */
  --tt-transition-duration-short: 0.1s;
  --tt-transition-duration-default: 0.2s;
  --tt-transition-duration-long: 0.64s;
  --tt-transition-easing-default: cubic-bezier(0.46, 0.03, 0.52, 0.96);

  /* Shadows */
  --tt-shadow-elevated-md:
    0px 16px 48px 0px rgba(17, 24, 39, 0.04),
    0px 12px 24px 0px rgba(17, 24, 39, 0.04),
    0px 6px 8px 0px rgba(17, 24, 39, 0.02),
    0px 2px 3px 0px rgba(17, 24, 39, 0.02);

  /* Global Colors */
  --tt-bg-color: var(--white);
  --tt-border-color: var(--tt-gray-light-a-200);
  --tt-sidebar-bg-color: var(--tt-gray-light-100);
  --tt-card-bg-color: var(--white);
}
```

---

## 2. Core Components (핵심 컴포넌트)

### 2.1 MainCard (`src/components/MainCard.tsx`)

```tsx
interface MainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  children?: ReactNode;
  content?: boolean;
  contentSX?: CardContentProps['sx'];
  darkTitle?: boolean;
  divider?: boolean;
  elevation?: number;
  secondary?: CardHeaderProps['action'];
  shadow?: string;
  title?: ReactNode | string;
  modal?: boolean;
}

<Card
  sx={{
    position: 'relative',
    border: border ? '1px solid' : 'none',
    borderRadius: 1,
    borderColor: theme.palette.grey.A800,
    boxShadow: boxShadow ? shadow || theme.customShadows.z1 : 'inherit',
    ':hover': {
      boxShadow: boxShadow ? shadow || theme.customShadows.z1 : 'inherit'
    },
    // Modal positioning
    ...(modal && {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: 'calc(100% - 50px)', sm: 'auto' }
    })
  }}
>
  {title && <CardHeader sx={{ p: 2.5 }} title={title} action={secondary} />}
  {title && divider && <Divider />}
  {content && <CardContent sx={contentSX}>{children}</CardContent>}
</Card>
```

### 2.2 CommonButton (`src/components/buttons/CommonButton.tsx`)

```tsx
interface CommonButtonProps extends ButtonProps {
  icon?: ReactNode;
  loading?: boolean;
  icononly?: 'true' | 'false';
  title?: string;
  authkey?: string;
}

// Icon Button
<Tooltip title={props.title} arrow>
  <IconButton onClick={handleButtonAction} disabled={props.disabled}>
    {props.icon}
  </IconButton>
</Tooltip>

// Regular Button
<LoadingButton
  loading={props.loading}
  startIcon={props.icon}
  loadingPosition="center"
  sx={{ opacity: props.disabled ? 0.7 : 1 }}
  {...props}
>
  {props.title || ''}
</LoadingButton>
```

### 2.3 FormInput (`src/components/input/FormInput.tsx`)

```tsx
interface FormInputProps extends TextFieldProps<'outlined'> {
  label: string;
  required?: boolean;
  width?: number | string;
  dateString?: boolean;
}

<Box display="flex" flexDirection="column" width={width}>
  <Typography variant="subtitle1">
    {label}
    {required && <span style={{ color: 'red', paddingLeft: 4 }}>*</span>}
  </Typography>
  <TextField
    variant="outlined"
    {...props}
  />
</Box>
```

### 2.4 SelectBox (`src/components/select/SelectBox.tsx`)

```tsx
interface BasicSelectProps {
  value: string;
  name: string;
  label: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  selectProps?: { items: Array<{label: string, value: string}>, hasAllOption?: boolean };
  disabled?: boolean;
}

<FormControl fullWidth>
  <InputLabel id={`select-label-${name}`}>{label}</InputLabel>
  <Select
    labelId={`select-label-${name}`}
    input={<OutlinedInput />}
    value={value}
    onChange={onChange}
    disabled={disabled}
  >
    {selectProps?.hasAllOption && (
      <MenuItem value="ALL">전체</MenuItem>
    )}
    {selectProps?.items?.map((el) => (
      <MenuItem key={el.value} value={el.value}>
        {el.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

---

## 3. Page Components (페이지 컴포넌트)

### 3.1 Login Form (`src/pages/auth/sections/auth/auth-forms/AuthLogin.tsx`)

```tsx
<form noValidate onSubmit={handleSubmit}>
  <Grid container spacing={2}>
    {/* User ID Input */}
    <Grid item xs={12}>
      <Stack spacing={1}>
        <InputLabel sx={{ pl: 1, fontSize: '0.9rem' }}>
          아이디
        </InputLabel>
        <OutlinedInput
          type="userId"
          value={values.userId}
          name="userId"
          placeholder="아이디를 입력하세요"
          fullWidth
          sx={{ height: 48 }}
        />
      </Stack>
    </Grid>

    {/* Password Input */}
    <Grid item xs={12}>
      <Stack spacing={1}>
        <InputLabel sx={{ pl: 1, fontSize: '0.9rem' }}>
          비밀번호
        </InputLabel>
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          name="password"
          placeholder="비밀번호를 입력하세요"
          sx={{ height: 48 }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword}>
                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </IconButton>
            </InputAdornment>
          }
        />
      </Stack>
    </Grid>

    {/* Login Button */}
    <Grid item xs={12}>
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="primary"
        sx={{ height: 48 }}
      >
        로그인
      </Button>
    </Grid>

    {/* Remember ID Checkbox */}
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            name="checked"
            color="primary"
            size="small"
          />
        }
        label={<Typography variant="h6">아이디 저장</Typography>}
      />
    </Grid>
  </Grid>
</form>
```

### 3.2 Open Issue Page (`src/pages/qms/qms/open-issue/index.tsx`)

```tsx
// Layout Structure
<BasicLayout>
  <Box display="flex" height="100%">
    {/* Left Panel - Navigation */}
    <Box flex="0 1 15vw" p={1} minWidth={200} display="flex" flexDirection="column">
      {/* Select Box */}
      <Box pb={1}>
        <SelectBox
          value={selectedPlace}
          onChange={(e) => setSelectedPlace(e.target.value)}
          name="listSet"
          label="Open Issue"
          selectProps={{
            items: openIssueCategory?.map((el) => ({
              label: el.korNm ?? '',
              value: el.name
            }))
          }}
        />
      </Box>

      {/* Navigation List */}
      <Box overflow="auto" flex={1}>
        <NavList
          dataArr={filterDataArr}
          onItemClick={onItemClick}
          onItemContextMenu={(e, url) => {
            if (selectedPlace !== 'DEPT') return;
            handleOpen(e);
            setTargetGroup(url);
          }}
        />
      </Box>
    </Box>

    {/* Right Panel - Table */}
    {selectedPlace === 'DEPT' ? (
      <DeptTable
        selectedGroup={selectedGroup}
        selectedTeam={selectedTeam}
        selectedPlace={selectedPlace}
      />
    ) : (
      <DevTable
        setMode={setMode}
        selectedGroup={selectedGroup}
        selectedTeam={selectedTeam}
      />
    )}
  </Box>

  {/* Context Menu */}
  <ContextMenu
    options={contextMenuItems}
    mouseX={mouseX}
    mouseY={mouseY}
    open={menuOpen}
    onClose={handleClose}
  />
</BasicLayout>

// Context Menu Options
const contextMenuItems = [
  {
    label: '상세정보',
    onClick: () => issueCategoryDialogRef.current?.open(),
    icon: <FontAwesomeIcon icon={faInfoCircle} />
  },
  {
    label: '추가',
    onClick: () => issueCategoryDialogRef.current?.openRegist(),
    icon: <FontAwesomeIcon icon={faPlus} />
  },
  {
    label: '삭제',
    onClick: handleRemoveGroup,
    icon: <FontAwesomeIcon icon={faTrash} />
  }
];

// Importance Options
const importanceList = [
  { label: '하', value: '1' },
  { label: '중', value: '2' },
  { label: '상', value: '3' },
  { label: '지시사항', value: '4' },
  { label: '긴급', value: '5' }
];
```

---

## 4. Data Types (데이터 타입)

### 4.1 Open Issue Type

```typescript
interface OpenIssueType {
  oid: number;
  type: string;
  placeOfIssue?: string;
  productionSite?: string;
  oemLibNm: string;
  category: string;
  itemNm: string;
  projectNm: string;
  gateNum?: string;
  gateName?: string;
  contents?: string;
  assignedTo?: string;
  description: string;
  issueManagerNm?: string;
  issueManagers?: string[];
  managerNm?: string;
  managerTeam: string;
  management: string;
  report: string;
  importance: string;        // '1' | '2' | '3' | '4' | '5'
  importanceNm: string;      // '하' | '중' | '상' | '지시사항' | '긴급'
  issueNo?: string;
  issueState?: string;
  issueStateNm?: string;
  issueType?: string;
  status: string;
  strDt: string;             // 'YYYY-MM-DD'
  finDt: string;
  closeDt?: string;
  duration: string;
  delayDt?: number;
  remark: string;
}

// Default Values
const initOpenIssue = {
  oid: -1,
  type: '',
  strDt: dayjs().format('YYYY-MM-DD'),
  finDt: '',
  management: 'false',
  // ...
};
```

### 4.2 Menu/Navigation Type

```typescript
interface OpenIssueMenu {
  key: string;
  title: string;
  children?: OpenIssueMenu[];
}

interface ListDataProps {
  text: string;
  url: string;
  children?: ListDataProps[];
  isParent: boolean;
}
```

---

## 5. File Structure (파일 구조)

```
open-issue-web/
├── src/
│   ├── themes/
│   │   ├── index.tsx              # Theme provider
│   │   ├── palette.ts             # Color definitions
│   │   ├── typography.ts          # Typography config
│   │   ├── shadows.tsx            # Shadow definitions
│   │   ├── theme/                 # Theme presets
│   │   │   ├── default.ts
│   │   │   └── theme1-8.ts
│   │   ├── typography/
│   │   │   ├── sm.ts              # Small font size
│   │   │   ├── md.ts              # Medium (default)
│   │   │   └── lg.ts              # Large font size
│   │   └── overrides/             # Component overrides
│   │       ├── Button.ts
│   │       ├── TextField.ts
│   │       └── ...
│   │
│   ├── styles/
│   │   ├── _variables.scss        # CSS variables
│   │   └── _keyframe-animations.scss
│   │
│   ├── components/
│   │   ├── MainCard.tsx           # Main card wrapper
│   │   ├── buttons/
│   │   │   └── CommonButton.tsx
│   │   ├── input/
│   │   │   ├── FormInput.tsx
│   │   │   └── SearchInput.tsx
│   │   ├── select/
│   │   │   ├── SelectBox.tsx
│   │   │   └── FormSelect.tsx
│   │   ├── grid/
│   │   │   └── CommonGrid.tsx     # AG Grid wrapper
│   │   ├── dialogs/
│   │   │   └── BasicDialog.tsx
│   │   └── list/
│   │       └── NavList.tsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   └── login.tsx
│   │   └── qms/
│   │       └── qms/
│   │           └── open-issue/
│   │               ├── index.tsx
│   │               └── section/
│   │                   ├── DeptTable.tsx
│   │                   └── DevTable.tsx
│   │
│   └── layout/
│       ├── Dashboard/
│       │   ├── index.tsx
│       │   ├── Header/
│       │   └── Drawer/
│       └── Basic/
│           └── index.tsx
```

---

## 6. Key Dependencies

```json
{
  "dependencies": {
    "@mui/material": "^5.x",
    "@mui/icons-material": "^5.x",
    "@ant-design/colors": "^7.x",
    "@ant-design/icons": "^5.x",
    "@fortawesome/fontawesome-svg-core": "^6.x",
    "@fortawesome/free-solid-svg-icons": "^6.x",
    "@fortawesome/react-fontawesome": "^0.2.x",
    "ag-grid-enterprise": "^31.x",
    "ag-grid-react": "^31.x",
    "formik": "^2.x",
    "dayjs": "^1.x"
  }
}
```

---

*Document Version: 1.0*
*Generated for Figma Make integration*
*Last Updated: 2026-02-05*
