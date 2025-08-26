import './icon-picker.scss';
import 'tabler-dynamic-icon/styles.css';

import { ActionIcon, Box, Flex, Popover, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { clsx } from 'clsx';
import { type ComponentProps, type JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeGrid, type GridChildComponentProps } from 'react-window';
import { Icon , IconsClassName } from 'tabler-dynamic-icon';

type IconCls = ComponentProps<typeof Icon>['cls'];

interface Props {
    color?: string;
    defaultIcon?: string;
    direction?: 'ltr' | 'rtl';
    filterIcons?: string[];
    height?: number;
    iconComponent?: (props: { iconName: string|IconCls; iconSize?: number; isSelected?: boolean }) => JSX.Element;
    iconSize?: number;
    iconsList?: string[];
    itemPerColumn?: number;
    itemSize?: number;
    noIconFoundMessage?: string;
    noIconsInListMessage?: string;
    onSelect?: (icon: string|IconCls) => void;
    overscanRowCount?: number;
    searchPlaceholder?: string;
    searchTextInputSize?: ComponentProps<typeof TextInput>['size'];
    showSearchBar?: boolean;
    value?: string;
}

export const IconPicker = ({
    color,
    defaultIcon,
    direction = 'ltr',
    filterIcons = [],
    height = 300,
    iconComponent,
    iconSize,
    iconsList,
    itemPerColumn = 9,
    itemSize = 30,
    noIconFoundMessage = 'No icons found',
    noIconsInListMessage = 'No icons in list',
    onSelect,
    overscanRowCount = 4,
    searchPlaceholder,
    searchTextInputSize = 'xs',
    showSearchBar = false,
    value,
}: Props) => {
    const [selected_icon_index, setSelectedIconIndex] = useState<number | null>(null);
    const [selected_icon, setSelectedIcon] = useState<string | IconCls | null>(null);
    const [search_query, setSearchQuery] = useState<string>('');
    const [debounced_search_query, setDebouncedSearchQuery] = useState<string>('');
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [is_open, { close, toggle }] = useDisclosure(false);
    const icons = useMemo(() => iconsList || IconsClassName, [iconsList]);

    const filtered_icons = useMemo(() => {
        return icons
            .filter(icon => !filterIcons.includes(icon))
            .filter(icon => icon.toLowerCase().includes(debounced_search_query.toLowerCase()));
    }, [icons, filterIcons, debounced_search_query]);

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            setDebouncedSearchQuery(search_query);
        }, 250);
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [search_query]);

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
        setSearchQuery('');
        onSelect?.(icon);
    }, [close, onSelect]);

    const GridItem = useCallback(({
        columnIndex,
        rowIndex,
        style,
    }: GridChildComponentProps) => {
        const index = (rowIndex * itemPerColumn) + columnIndex;
        const iconName = filtered_icons[index] as IconCls;

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
    }, [itemPerColumn, filtered_icons, selected_icon_index, iconComponent, iconSize, handleIconClick]);

    return (
        <Popover
            keepMounted
            offset={2}
            opened={is_open}
            position="bottom"
            styles={{ dropdown: { padding: 8 } }}
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
            <Popover.Dropdown w={(itemPerColumn * itemSize) + 27}>
                <Stack gap={8}>
                    {showSearchBar && (
                        <TextInput
                            placeholder={searchPlaceholder}
                            size={searchTextInputSize}
                            value={search_query}
                            onChange={(e) => setSearchQuery(e.currentTarget.value)}
                        />
                    )}
                    {filtered_icons.length > 0 ? (
                        <FixedSizeGrid
                            className="icon-picker__grid"
                            columnCount={itemPerColumn}
                            columnWidth={itemSize}
                            direction={direction}
                            height={height}
                            overscanRowCount={overscanRowCount}
                            rowCount={Math.ceil(filtered_icons.length / itemPerColumn)}
                            rowHeight={itemSize}
                            width={(itemPerColumn * itemSize) + 9}
                        >
                            {GridItem}
                        </FixedSizeGrid>
                    ) : (
                        <Box
                            bdrs="sm"
                            className="icon-picker__no-icons"
                            p={8}
                            style={{ border: '1px solid var(--mantine-color-gray-2)' }}
                        >
                            <Text
                                c="dimmed"
                                size="sm"
                                ta="center"
                            >
                                {debounced_search_query ? noIconFoundMessage : noIconsInListMessage}
                            </Text>
                        </Box>
                    )}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
};
