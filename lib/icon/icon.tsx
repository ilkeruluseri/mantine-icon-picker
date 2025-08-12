import type { IconProps } from '@tabler/icons-react';
import * as IconSet from '@tabler/icons-react';

interface IIconProps extends IconProps {
  name: string;
}

const Icon = ({ name, ...props }: IIconProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SelectedIcon = IconSet[name as keyof typeof IconSet] as any;
  
    if (!SelectedIcon) {
        console.error(`Icon "${name}" not found in IconSet.`);
        return null;
    }

    return <SelectedIcon {...props} />;
};
  
export type TIcon = keyof typeof IconSet;
export default Icon;
