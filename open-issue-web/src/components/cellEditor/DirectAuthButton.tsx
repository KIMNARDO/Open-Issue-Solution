import { IRowNode } from 'ag-grid-community';
import { CustomCellRendererProps } from 'ag-grid-react';
import CommonButton, { CommonButtonProps } from 'components/buttons/CommonButton';

interface DirectButtonProps<T> {
  onClick: ({
    event,
    data,
    node
  }: {
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>;
    data: T;
    node: IRowNode<T>;
  }) => void | undefined;
}

export type DirectButtonRendererProps<T> = CustomCellRendererProps & Omit<CommonButtonProps, 'onClick' | 'sx'> & DirectButtonProps<T>;

const initProps = <T extends {}>(props: DirectButtonRendererProps<T>) => {
  if (!props.variant) {
    props.variant = 'contained';
  }
};

const DirectButtonRenderer = <T extends {}>({ ...props }: DirectButtonRendererProps<T>) => {
  const handleButtonAction = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onClick) {
      props.onClick({ event, data: props.data, node: props.node });
    }
  };

  initProps<T>(props);

  return (
    <CommonButton
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: props.icononly === 'true' ? 0 : undefined,
        fontSize: props.icononly === 'true' ? '1.2rem' : undefined
      }}
      {...props}
      onClick={handleButtonAction}
      variant="contained"
      icon={props.icononly === 'true' ? props.icon : undefined}
    />
  );
};

export default DirectButtonRenderer;
