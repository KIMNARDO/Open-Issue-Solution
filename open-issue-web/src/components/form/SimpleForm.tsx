import SearchBarFrame from 'components/searchbar/SearchBarFrame';
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import useAuth from 'hooks/useAuth';
import { useStackBar } from 'layout/Dashboard/Drawer/StackBar/store/useStackBar';
import { CSSProperties, forwardRef, ReactNode } from 'react';
import { getUserAuth } from 'utils/commonUtils';

interface SimpleFormProps<T> {
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<T>;
  initialValues: T;
  validationSchema?: any | (() => any);
  containerStyle?: CSSProperties;
}

interface SimpleSearchFormProps<T> {
  btnActions: Record<string, (...args: any) => void>;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<T>;
  initialValues: T;
  title?: string;
  tooltip?: ReactNode;
  useTitle?: boolean;
  direction?: 'start' | 'center' | 'end';
  description?: string;
}

interface SimpleFormHOCChildrenProps<T> {
  formikProps: FormikProps<T>;
}

interface SimpleSearchFormHOCChildrenProps<T> {
  formikProps: FormikProps<T>;
  btnActions: Record<string, (...args: any) => void>;
  modPermAt: boolean;
  execPermAt: boolean;
}

export const withSimpleForm = <T extends FormikValues, P = {}>(
  WrappedComponent: React.ComponentType<SimpleFormHOCChildrenProps<T> & P>
) => {
  return forwardRef<FormikProps<T>, SimpleFormProps<T> & P>(
    ({ onSubmit, initialValues, validationSchema, containerStyle, ...props }, ref) => {
      return (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          innerRef={ref}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(formik) => (
            <Form style={containerStyle}>
              <WrappedComponent formikProps={formik} {...(props as P)} />
            </Form>
          )}
        </Formik>
      );
    }
  );
};

export const withSimpleSearchForm = <T extends FormikValues, P = {}>(
  WrappedComponent: React.ComponentType<SimpleSearchFormHOCChildrenProps<T> & P>
) => {
  return forwardRef<FormikProps<T>, SimpleSearchFormProps<T> & P>(
    ({ onSubmit, initialValues, btnActions, title, useTitle, direction, tooltip, description, ...props }, ref) => {
      const { user } = useAuth();
      const { getActiveMenu } = useStackBar();
      const modPermAt = getUserAuth(user, 'modPermAt', getActiveMenu()?.id ?? '');
      const execPermAt = getUserAuth(user, 'execPermAt', getActiveMenu()?.id ?? '');
      return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} innerRef={ref}>
          {(formik) => (
            <Form>
              <SearchBarFrame title={title ?? ''} direction={direction} useTitle={useTitle} description={description} tooltip={tooltip}>
                <WrappedComponent
                  formikProps={formik}
                  btnActions={btnActions}
                  modPermAt={modPermAt}
                  execPermAt={execPermAt}
                  {...(props as P)}
                />
              </SearchBarFrame>
            </Form>
          )}
        </Formik>
      );
    }
  );
};
