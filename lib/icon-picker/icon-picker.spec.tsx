// IconPicker.test.tsx
import { fireEvent, render, screen, waitFor } from '../test';

// -------------------- Mocks --------------------

// @mantine/hooks: useDisclosure driven by React state
vi.mock('@mantine/hooks', async () => {
    const React = await import('react');
    return {
        useDisclosure: (initial = false) => {
            const [opened, setOpened] = React.useState<boolean>(initial);
            const api = React.useMemo(
                () => ({
                    close: () => setOpened(false),
                    open: () => setOpened(true),
                    toggle: () => setOpened((v) => !v),
                }),
                [],
            );
            return [opened, api] as const;
        },
    };
});

// @mantine/core: controlled Popover via context + simple primitives
vi.mock('@mantine/core', async () => {
    const React = await import('react');

    const ActionIcon = ({
        children,
        onClick,
        ...rest
    }: any) => (
        <button
            data-testid="icon-trigger"
            type="button"
            onClick={onClick}
            {...rest}
        >
            {children}
        </button>
    );
    const Flex = (p: any) => <div {...p} />;
    const Group = (p: any) => <div {...p} />;
    const Stack = (p: any) => <div {...p} />;
    const TextInput = ({
        onChange,
        placeholder,
        ...rest
    }: any) => (
        <input
            aria-label={placeholder || 'text-input'}
            placeholder={placeholder}
            onChange={onChange}
            {...rest}
        />
    );

    type PopCtx = { opened: boolean };
    const PopoverCtx = React.createContext<PopCtx>({ opened: false });

    const PopoverBase: React.FC<
    { children: React.ReactNode; opened?: boolean } & Record<string, any>
    > = ({ children, opened = false }) => (
        <PopoverCtx.Provider value={{ opened }}>
            <div data-testid="popover">{children}</div>
        </PopoverCtx.Provider>
    );

    // eslint-disable-next-line react/jsx-no-useless-fragment
    const PopoverTarget: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

    const PopoverDropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const { opened } = React.useContext(PopoverCtx);
        return opened ? <div data-testid="popover-dropdown">{children}</div> : null;
    };

    const Popover: any = PopoverBase;
    Popover.Target = PopoverTarget;
    Popover.Dropdown = PopoverDropdown;

    const useMantineTheme = () => ({
        colors: { blue: { 400: '#339af0' } },
        white: '#fff',
    });

    return { ActionIcon, Flex, Group, Popover, Stack, TextInput, useMantineTheme };
});

// Tabler icons: include some icons + internal keys to validate filters
vi.mock('@tabler/icons-react', () => {
    const make = (label: string) => function(props: any) {
        return <span {...props}>{label}</span>;
    };
    return {
        // internal keys that should be filtered
        createReactComponent: make('createReactComponent'),
        IconArrowLeft: make('IconArrowLeft'),
        IconChevronDown: make('IconChevronDown'),
        IconHome: make('IconHome'),
        IconQuestionMark: make('IconQuestionMark'),
        icons: make('icons'),
        IconSettings: make('IconSettings'),
        iconsList: make('iconsList'),
        IconUser: make('IconUser'),
    };
});

// Your Icon wrapper mock (prints data-name for assertions)
vi.mock('../icon', () => {
    return {
        Icon: ({
            name,
            ...rest
        }: { name: string }) => (
            <span
                data-name={name}
                data-testid="icon-cell"
                {...rest}
            >
                {name}
            </span>
        ),
    };
});

// TanStack Virtual mock: capture options + stable stub
const scrollToIndexMock = vi.fn();
let lastVirtualizerOptions: any; // <-- capture here

vi.mock('@tanstack/react-virtual', () => {
    const useVirtualizer = vi.fn((opts: any) => {
        lastVirtualizerOptions = opts; // <-- store options passed by your component
        return {
            getTotalSize: () => 48,
            getVirtualItems: () => [{ index: 0, key: 'row-0', start: 0 }],
            scrollToIndex: scrollToIndexMock,
        };
    });

    // expose a getter to your tests
    const __getLastOptions = () => lastVirtualizerOptions;

    return { __getLastOptions, useVirtualizer };
});


// -------------------- Import SUT (after mocks) --------------------
import * as Virtual from '@tanstack/react-virtual';

import { IconPicker } from './icon-picker';

// -------------------- Helpers --------------------
const openPicker = async () => {
    if (!screen.queryByTestId('popover-dropdown')) {
        fireEvent.click(screen.getByTestId('icon-trigger'));
    }
    await waitFor(() => {
        expect(screen.getByTestId('popover-dropdown')).toBeInTheDocument();
    });
};

// -------------------- Tests --------------------
describe('IconPicker', () => {
    beforeEach(() => {
        scrollToIndexMock.mockClear();
    });

    it('renders the trigger with fallback icon and toggles popover', async () => {
        render(<IconPicker />);
        // Trigger exists
        expect(screen.getByTestId('icon-trigger')).toBeInTheDocument();

        // Open
        await openPicker();
        expect(screen.getByPlaceholderText('Search for an icon')).toBeInTheDocument();

        // Close
        fireEvent.click(screen.getByTestId('icon-trigger'));
        await waitFor(() => {
            expect(screen.queryByTestId('popover-dropdown')).not.toBeInTheDocument();
        });
    });

    it('provides estimateSize and getScrollElement in virtualizer options', async () => {
        render(<IconPicker />);

        // Ensure the grid is mounted (so useVirtualizer is called)
        await openPicker();

        const opts: any = (Virtual as any).__getLastOptions();
        expect(opts).toBeTruthy();

        // estimateSize should return the row height (48 in your component)
        expect(typeof opts.estimateSize).toBe('function');
        expect(opts.estimateSize()).toBe(48);

        // getScrollElement should return the parent div (not null)
        expect(typeof opts.getScrollElement).toBe('function');
        const el = opts.getScrollElement();
        expect(el).toBeInstanceOf(HTMLDivElement);
        expect(el).not.toBeNull();
    });


    it('shows icons and filters out "arrow", "chevron", and internal keys', async () => {
        render(<IconPicker />);
        await openPicker();

        // Internal keys should be filtered
        const allCells = screen.getAllByTestId('icon-cell').map((el) => el.getAttribute('data-name'));
        expect(allCells).not.toContain('createReactComponent');
        expect(allCells).not.toContain('icons');
        expect(allCells).not.toContain('iconsList');

        // Arrow/Chevron must be filtered
        expect(allCells).not.toContain('IconArrowLeft');
        expect(allCells).not.toContain('IconChevronDown');

        // Search narrows the list (type "user" -> IconUser remains)
        const input = screen.getByPlaceholderText('Search for an icon');
        fireEvent.change(input, { target: { value: 'user' } });

        await waitFor(() => {
            const filtered = screen.getAllByTestId('icon-cell').map((el) => el.getAttribute('data-name'));
            expect(filtered).toContain('IconUser');
            expect(filtered).not.toContain('IconHome');
        });
    });

    it('does nothing in VirtualizedIconGrid when selected icon not found', async () => {
        // This value will NOT exist in the mocked IconSet
        render(<IconPicker value="IconDoesNotExist" />);
        await openPicker();

        // The branch should execute but not call scrollToIndex
        await waitFor(() => {
            expect(scrollToIndexMock).not.toHaveBeenCalled();
        });
    });

    it('calls onChange when an icon is selected and closes the popover', async () => {
        const onChange = vi.fn();
        render(<IconPicker onChange={onChange} />);

        await openPicker();

        // Select IconHome
        const homeCell = screen
            .getAllByTestId('icon-cell')
            .find((el) => el.getAttribute('data-name') === 'IconHome')!;
        fireEvent.click(homeCell);

        expect(onChange).toHaveBeenCalledWith('IconHome');

        // Popover should close after selection
        await waitFor(() => {
            expect(screen.queryByTestId('popover-dropdown')).not.toBeInTheDocument();
        });
    });

    it('reflects controlled value and scrolls to it when opened', async () => {
        const { rerender } = render(<IconPicker value="IconUser" />);

        // open initially
        await openPicker();

        await waitFor(() => {
            expect(scrollToIndexMock).toHaveBeenCalled();
        });

        // Trigger shows IconUser
        const trigger = screen.getByTestId('icon-trigger');
        const inner = trigger.querySelector('[data-testid="icon-cell"]') as HTMLElement;
        expect(inner?.getAttribute('data-name')).toBe('IconUser');

        // Change value
        rerender(<IconPicker value="IconSettings" />);

        // Ensure the dropdown is open (don’t accidentally close it)
        await openPicker();

        // Either the value change or the re-open should cause another scroll
        await waitFor(() => {
            expect(scrollToIndexMock.mock.calls.length).toBeGreaterThanOrEqual(2);
        });

        // And the trigger reflects the controlled value
        const inner2 = trigger.querySelector('[data-testid="icon-cell"]') as HTMLElement;
        expect(inner2?.getAttribute('data-name')).toBe('IconSettings');
    });
});
