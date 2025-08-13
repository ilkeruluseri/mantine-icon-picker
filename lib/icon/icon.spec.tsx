// Icon.test.tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

vi.mock('@tabler/icons-react', () => {
    const MockIcon =
    (testId: string) =>
        function(props: React.SVGProps<SVGSVGElement>) {
            return (
                <svg
                    data-testid={testId}
                    {...props}
                />
            );
        };

    return {
        __esModule: true,
        IconDoesNotExist: undefined,
        // mimic real Tabler export names like IconHome, IconUser, etc.
        IconHome: MockIcon('icon-home'),
        IconUser: MockIcon('icon-user'),
    };
});

import { Icon } from './icon';

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

describe('<Icon />', () => {
    it('renders the selected icon when name exists', () => {
        render(
            <Icon
                aria-label="home"
                name="IconHome"
            />,
        );
        const el = screen.getByTestId('icon-home');
        expect(el).toBeInTheDocument();
        // sanity check that aria-label got forwarded to the <svg>
        expect(el).toHaveAttribute('aria-label', 'home');
    });

    it('forwards props to the underlying icon', () => {
        const handleClick = vi.fn();
        render(
            <Icon
                className="my-class"
                name="IconUser"
                stroke={1.5}
                title="user-icon"
                onClick={handleClick}
            />,
        );
        const el = screen.getByTestId('icon-user');
        expect(el).toBeInTheDocument();
        expect(el).toHaveAttribute('class', 'my-class');
        // numeric props will end up as attributes/props on the element
        // depending on JSX runtime; we just assert the click worked
        fireEvent.click(el);
        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(el).toHaveAttribute('title', 'user-icon');
    });

    it('logs an error and renders nothing when icon name is not found', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const { container } = render(<Icon name="IconDoesNotExist" />);
        // returns null -> empty container
        expect(container).toBeEmptyDOMElement();
        expect(spy).toHaveBeenCalledWith('Icon "IconDoesNotExist" not found in IconSet.');
    });
});
