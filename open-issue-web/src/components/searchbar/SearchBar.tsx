import { Box, Checkbox, FormControlLabel, Stack, TextField, Tooltip, Typography } from '@mui/material';
import CommonButton, { ButtonAuthTypes } from 'components/buttons/CommonButton';
import MainCard from 'components/MainCard';
import BasicSelect from 'components/select/BasicSelect';
import { FormikProps } from 'formik';
import { SearchBarItem } from './searchbar.types';
import FormDatePicker from 'components/datepicker/FormDatePicker';
import FormDateRangePicker from 'components/datepicker/FormDateRangePicker';
import ComboSelect from 'components/select/ComboSelect';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { GroupAuthKey, GroupAuthority } from 'api/system/user/user.types';
import useAuth from 'hooks/useAuth';

const getButtonAuthKey = (itemId: string): GroupAuthKey | null => {
  if (itemId.includes(ButtonAuthTypes.ADD) || itemId.includes(ButtonAuthTypes.SAVE)) {
    return 'modPermAt';
  }

  if (itemId.includes(ButtonAuthTypes.SEARCH) || itemId.includes(ButtonAuthTypes.RESET)) {
    return 'viewPermAt';
  }

  if (itemId.includes(ButtonAuthTypes.DELETE)) {
    return 'delPermAt';
  }

  // if (itemId.includes(ButtonAuthTypes.DOWNLOAD)) {
  //   return 'downloadYn';
  // }

  // if (itemId.includes(ButtonAuthTypes.PRINT)) {
  //   return 'printYn';
  // }

  return null;
};

interface SearchBarProps<T extends {}> {
  //title?: string;
  items: SearchBarItem[];
  reverse?: boolean;
  formik: FormikProps<T>;
  border?: boolean;
  title?: string;
}

const defaultWidth = 100;

/**
 *
 * @param reverse 배치 순서
 * @param items 배치될 아이템 정의 (버튼, input, select 등)
 * @param formik useFormik 객체
 * @param border 테두리유무
 * @param title 좌측 상단에 표시될 타이틀
 * @description 상단 검색창 컴포넌트
 */
export default function SearchBar<T extends {}>({ reverse, items, formik, border = false, title }: SearchBarProps<T>) {
  const boxRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [wrapToolbar, setWrapToolbar] = useState<boolean>(false);
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [currentAuth, setCurrentAuth] = useState<GroupAuthority>();

  const pathname = window.location.pathname;
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      let itemHeight = itemRef.current && itemRef.current.offsetHeight;
      if (itemHeight && itemHeight > 32) {
        setWrapToolbar(true);
      } else {
        setWrapToolbar(false);
        setShowToolbar(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (pathname && user) {
      const auth = user.groupAuthority?.find((f) => f.menuPath === pathname);

      if (auth) {
        setCurrentAuth(auth);
      }
    }
  }, [pathname, user]);

  const isButtonDisabledByAuth = (itemId: string) => {
    try {
      const authType = getButtonAuthKey(itemId);

      if (!authType || !currentAuth) {
        return false;
      }

      const auth = currentAuth[authType] === 'Y' ? false : true;

      return auth;
    } catch (_) {
      return false;
    }
  };

  return (
    <Box ref={boxRef} width="100%" maxHeight={showToolbar ? 'max-content' : 52} overflow="hidden" flex="1 0 auto !important">
      {border ? (
        <MainCard>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ padding: 1.2 }}>
            <Typography
              variant="h5"
              sx={{
                height: 32,
                minHeight: 32,
                lineHeight: '32px',
                textIndent: 4,
                flexBasis: 0,
                flexGrow: 1,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                marginRight: 1
              }}
            >
              {title ?? ''}
            </Typography>
            <Stack
              ref={itemRef}
              spacing={1}
              direction={reverse ? 'row-reverse' : 'row'}
              flexWrap={reverse ? 'wrap' : 'wrap-reverse'}
              height="max-content"
            >
              {wrapToolbar && (
                <button
                  onClick={() => setShowToolbar(!showToolbar)}
                  style={{ border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', color: '#F47920' }}
                >
                  <FontAwesomeIcon icon={faChevronCircleDown} />
                </button>
              )}
              {items.map((item, idx) => (
                <div key={`searchbar-item-${idx}`}>{renderSearchBarItem(item, idx, formik)}</div>
              ))}
            </Stack>
          </Box>
        </MainCard>
      ) : (
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ padding: 1.2 }}>
          <Typography
            variant="h5"
            sx={{
              height: 32,
              lineHeight: '32px',
              textIndent: 4,
              flexBasis: 0,
              flexGrow: 1,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              marginRight: 1
            }}
          >
            {title ?? ''}
          </Typography>
          <Stack
            ref={itemRef}
            spacing={1}
            direction={reverse ? 'row-reverse' : 'row'}
            flexWrap={reverse ? 'wrap' : 'wrap-reverse'}
            gap={wrapToolbar ? '18px 2px' : 'unset'}
            height="max-content"
          >
            {wrapToolbar && (
              <button
                onClick={() => setShowToolbar(!showToolbar)}
                style={{ border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', color: '#F47920' }}
              >
                <FontAwesomeIcon icon={showToolbar ? faChevronCircleUp : faChevronCircleDown} />
              </button>
            )}
            {items
              .filter((f) => !f.hidden)
              .map((item, idx) => {
                const _btnAuth = isButtonDisabledByAuth(item.id);

                item.btnProps = {
                  ...item.btnProps,
                  hidden: _btnAuth
                };

                return <div key={`searchbar-item-${idx}`}>{renderSearchBarItem(item, idx, formik)}</div>;
              })}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

function renderSearchBarItem<T>(item: SearchBarItem, idx: number, formik: FormikProps<T>) {
  const trueValue = item.checkBoxProps?.trueValue || 'Y';
  const falseValue =
    item.checkBoxProps?.falseValue === null || item.checkBoxProps?.falseValue === undefined ? 'N' : item.checkBoxProps?.falseValue;
  switch (item.type) {
    case 'input':
      return (
        <TextField
          placeholder={item.placeholder}
          sx={{ width: item.width || defaultWidth }}
          id={`searchbar-input-${item.id}`}
          key={`searchbar-input-${item.id}`}
          label={item.label}
          name={item.id}
          value={formik.values[item.id as keyof T] || ''}
          onChange={formik.handleChange}
        />
      );
    case 'button':
      if (item.hidden) {
        return null;
      }
      return <CommonButton key={`searchbar-button-${item.id}`} variant="contained" title={item.label} {...item.btnProps} />;
    case 'checkbox':
      return (
        <Box display={'flex'} alignItems={'center'} key={`searchbar-checkbox-wrapper-${item.id}`}>
          <Tooltip title={item.placeholder} arrow>
            <FormControlLabel
              key={`searchbar-checkbox-${item.id}`}
              sx={{ userSelect: 'none', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
              control={<Checkbox size="large" checked={(formik.values[item.id as keyof T] as string) === trueValue ? true : false} />}
              label={item.label}
              name={item.id}
              onChange={(e, checked) => formik.handleChange({ target: { name: item.id, value: checked ? trueValue : falseValue } })}
            />
          </Tooltip>
        </Box>
      );
    case 'select':
      return (
        <BasicSelect
          key={`searchbar-select-${item.id}`}
          name={item.id}
          label={item.label || ''}
          value={(formik.values[item.id as keyof T] as string) || ''}
          width={item.width || defaultWidth}
          onChange={(e) => {
            formik.handleChange(e);
            item.selectProps?.onChange && item.selectProps.onChange(e);
          }}
          selectProps={item.selectProps}
          formik={formik}
        />
      );
    case 'date':
      return (
        <>
          <FormDatePicker<T>
            label=""
            key={`searchbar-date-${item.id}`}
            name={item.id}
            subLabel={item.label}
            setValue={formik.setFieldValue}
            error={formik.errors[item.id as keyof T] as string}
            value={formik.values[item.id as keyof T] as string}
            width={item.width || defaultWidth}
          />
        </>
      );
    case 'daterange':
      return (
        <>
          <FormDateRangePicker<T>
            label=""
            key={`searchbar-daterange-${item.id}`}
            startName={item.dataRangeProps?.startName || ''}
            endName={item.dataRangeProps?.endName || ''}
            setValue={formik.setFieldValue}
            values={formik.values}
            error={formik.errors[item.id as keyof T] as string}
            value={formik.values[item.id as keyof T] as string}
          />
        </>
      );
    case 'combo':
      return (
        <>
          <ComboSelect
            key={`searchbar-combo-${item.id}`}
            width={item.width || defaultWidth}
            name={item.id}
            label={item.label || ''}
            formik={formik}
            options={item.comboOptions?.options || []}
            onChange={item.comboOptions?.onChange}
          />
        </>
      );
    default:
      <></>;
  }
}
