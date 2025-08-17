import './icon-picker.scss';

import { ActionIcon, Flex, Popover } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { clsx } from 'clsx';
import { type ComponentProps, type JSX, useCallback, useEffect, useState } from 'react';
import { FixedSizeGrid, type GridChildComponentProps } from 'react-window';
import { Icon } from 'tabler-dynamic-icon';
import { IconsClassName } from 'tabler-dynamic-icon/classes';

type IconCls = ComponentProps<typeof Icon>['cls'];

interface Props {
    color?: string;
    defaultIcon?: string;
    direction?: 'ltr' | 'rtl';
    height?: number;
    iconComponent?: (props: { iconName: string|IconCls; iconSize?: number; isSelected?: boolean }) => JSX.Element;
    iconSize?: number;
    iconsList?: string[];
    itemPerColumn?: number;
    itemSize?: number;
    onSelect?: (icon: string|IconCls) => void;
    overscan_row_count?: number;
    value?: string;
}

export const IconPicker = ({
    color,
    defaultIcon,
    direction = 'ltr',
    height = 300,
    iconComponent,
    iconSize,
    iconsList,
    itemPerColumn = 9,
    itemSize = 30,
    onSelect,
    overscan_row_count = 4,
    value,
}: Props) => {
    const [selected_icon_index, setSelectedIconIndex] = useState<number | null>(null);
    const [selected_icon, setSelectedIcon] = useState<string | IconCls | null>(null);
    const [is_open, { close, toggle }] = useDisclosure(false);
    const icons = iconsList && iconsList.length > 0 ? iconsList : IconsClassName;

    useEffect(() => {
        if ((value || selected_icon) && is_open) {
            const iconIndex = value ? icons.findIndex(iconName => iconName === value) : icons.findIndex(iconName => iconName === selected_icon);
            if (iconIndex !== -1) setSelectedIconIndex(iconIndex);
            else setSelectedIconIndex(null);
        }
    }, [value, is_open, selected_icon, icons]);

    const handleIconClick = useCallback((icon: string | IconCls) => {
        close();
        setSelectedIcon(icon);
        onSelect?.(icon);
    }, [close, onSelect]);

    const GridItem = useCallback(({
        columnIndex,
        rowIndex,
        style,
    }: GridChildComponentProps) => {
        const index = (rowIndex * itemPerColumn) + columnIndex;
        const iconName = icons[index] as IconCls;

        if (!iconName) return null;

        const isSelected = selected_icon_index === index;

        return (
            <Flex
                align="center"
                justify="center"
                style={style}
                className={clsx('icon-picker__item', {
                    'icon-picker__item--selected': isSelected,
                })}
                onClick={() => handleIconClick(iconName)}
            >
                {iconComponent ? iconComponent({
                    iconName,
                    iconSize,
                    isSelected,
                }) : (
                    <Icon
                        cls={iconName}
                        size={iconSize}
                        className={clsx('icon-picker__icon', {
                            'icon-picker__icon--selected': isSelected,
                        })}
                    />
                )}
            </Flex>
        );
    }, [itemPerColumn, icons, selected_icon_index, iconComponent, iconSize, handleIconClick]);

    return (
        <Popover
            keepMounted
            offset={2}
            opened={is_open}
            position="bottom"
            styles={{ dropdown: { padding: 4 } }}
            width="auto"
            onDismiss={close}
        >
            <Popover.Target>
                <ActionIcon
                    color={color}
                    size="input-xs"
                    variant="light"
                    onClick={toggle}
                >
                    {iconComponent ? iconComponent({
                        iconName: value || selected_icon || defaultIcon,
                        iconSize,
                    }) : (
                        <Icon cls={(value as IconCls) || selected_icon as IconCls || 'photo-question'} />
                    )}
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown w={(itemPerColumn * itemSize) + 19}>
                <FixedSizeGrid
                    className="icon-picker__grid"
                    columnCount={itemPerColumn}
                    columnWidth={itemSize}
                    direction={direction}
                    height={height}
                    overscanRowCount={overscan_row_count}
                    rowCount={Math.ceil(icons.length / itemPerColumn)}
                    rowHeight={itemSize}
                    width={(itemPerColumn * itemSize) + 9}
                >
                    {GridItem}
                </FixedSizeGrid>
            </Popover.Dropdown>
        </Popover>
    );
};
