import './icon-picker.scss';

import { ActionIcon, Flex, Group, Popover, Stack, TextInput, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import * as IconSet from '@tabler/icons-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { ComponentProps, ForwardedRef, JSX } from 'react';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Icon } from '../icon';

interface IProps {
    onChange?: (iconName: string) => void;
    value?: string;
}

type TDisplayIcon = ComponentProps<typeof Icon>['name'];

type TIcon = {
    icon: JSX.Element;
    value: string;
};

const VirtualizedIconGrid = ({
    items,
    onSelect,
    selectedIcon,
}: { items: TIcon[]; onSelect: (name: string) => void; selectedIcon: string }) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const rowSize = 12;
    const rowHeight = 48;

    const virtualizer = useVirtualizer({
        count: Math.ceil(items.length / rowSize),
        estimateSize: () => rowHeight,
        getScrollElement: () => parentRef.current,
    });

    useEffect(() => {
        if (!selectedIcon || items.length === 0) return;

        const selectedIndex = items.findIndex((icon) => icon.value === selectedIcon);
        if (selectedIndex === -1) return;

        const selectedRowIndex = Math.floor(selectedIndex / rowSize);

        // behavior: 'smooth' scrolls nicely, but generates a warning for some reason
        virtualizer.scrollToIndex(selectedRowIndex, { align: 'center', behavior: 'auto' });
    }, [selectedIcon, items, virtualizer]);

    return (
        <div
            ref={parentRef}
            style={{
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '4px',
            }}
        >
            <div
                style={{
                    height: virtualizer.getTotalSize(),
                    position: 'relative',
                    width: '100%',
                }}
            >
                <Group
                    align="flex-start"
                    gap={4}
                    justify="flex-start"
                    wrap="wrap"
                >
                    {virtualizer.getVirtualItems().map((virtualRow) => {
                        const iconsInRow = items.slice(
                            virtualRow.index * rowSize,
                            (virtualRow.index + 1) * rowSize,
                        );

                        return (
                            <div
                                key={virtualRow.key}
                                style={{
                                    display: 'flex',
                                    gap: 4,
                                    left: 0,
                                    position: 'absolute',
                                    top: 0,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                {iconsInRow.map((icon) => {
                                    const isSelected =icon.value === selectedIcon;
                                    return (
                                        <div
                                            key={icon.value}
                                            style={{
                                                backgroundColor: isSelected ? '#228be6' : undefined,
                                                borderRadius: '4px',
                                                color: isSelected ? 'white' : undefined,
                                            }}
                                            onClick={() => onSelect(icon.value)}
                                        >
                                            {icon.icon}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </Group>
            </div>
        </div>
    );
};

export const IconPicker = forwardRef(({ onChange, value }: IProps, ref: ForwardedRef<HTMLButtonElement> | ForwardedRef<HTMLInputElement>) => {
    const theme = useMantineTheme();
    const [is_open, { close, open }] = useDisclosure(false);
    const [selected_icon, setSelectedIcon] = useState<'' | TDisplayIcon>('');
    const icon_size = 24;

    const handleIconSelect = useCallback((iconName: string) => {
        if (!iconName) return;
        setSelectedIcon(iconName);
        onChange?.(iconName);
    }, [onChange, setSelectedIcon]);

    const icons: TIcon[] = useMemo(() => {
        return Object.keys(IconSet).map((name, index) => ({
            icon: (
                <Flex
                    key={index}
                    align="center"
                    justify="center"
                    style={{
                        padding: '4px',
                    }}
                    styles={{
                        root: {
                            '&:hover': {
                                backgroundColor: theme?.colors.blue[400],
                                color: theme?.white,
                            },
                            borderRadius: '4px',
                            cursor: 'pointer',
                        },
                    }}
                    onClick={() => {
                        handleIconSelect(name);
                        close();
                    }}
                >
                    <Icon
                        name={name as TDisplayIcon}
                        size={icon_size}
                        stroke={1.5}
                    />
                </Flex>
            ),
            value: name,
        }));
    }, [theme, handleIconSelect, close]);

    // Search
    const [searchQuery, setSearchQuery] = useState('');
    const items = useMemo(() => (
        icons.filter((icon) => (
            icon.value !== 'createReactComponent' &&
            icon.value !== 'icons' && // These 2 caused issues and I don't know why
            icon.value !== 'iconsList' &&
            icon.value.toLowerCase().includes('arrow') === false &&
            icon.value.toLowerCase().includes('chevron') === false &&
            icon.value.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    ), [icons, searchQuery]);

    useEffect(() => {
        handleIconSelect(value || '');
    }, [value]);

    return (
        <Popover
            trapFocus
            withArrow
            opened={is_open}
            position="bottom"
            shadow="md"
            width={500}
            onDismiss={close}
        >
            <Popover.Target>
                <ActionIcon
                    ref={ref as ForwardedRef<HTMLButtonElement>}
                    size="sm"
                    variant="default"
                    onClick={() => is_open ? close() : open()}
                >
                    <Icon
                        name={selected_icon || (value as TDisplayIcon) || 'IconQuestionMark'}
                        size="18"
                        stroke={1.5}
                    />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack gap="xs">
                    <TextInput
                        placeholder="Search for an icon"
                        style={{
                            flex: '1 auto',
                        }}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {
                        items.length > 0 &&
                    <VirtualizedIconGrid
                        items={items}
                        selectedIcon={selected_icon || ''}
                        onSelect={(name) => {
                            handleIconSelect(name);
                        }}
                    />
                    }
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
});
