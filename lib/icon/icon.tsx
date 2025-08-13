import type { IconProps } from '@tabler/icons-react';
import * as IconSet from '@tabler/icons-react';

interface IIconProps extends IconProps {
    name: string;
}

export const Icon = ({
    name,
    ...props
}: IIconProps) => {
    const SelectedIcon = IconSet[name as keyof typeof IconSet] as React.ComponentType<IconProps>;

    if (!SelectedIcon) {
        console.error(`Icon "${name}" not found in IconSet.`);
        return null;
    }

    return <SelectedIcon {...props} />;
};

export type TIcon = keyof typeof IconSet;
