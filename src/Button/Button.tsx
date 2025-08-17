import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * The color of the button.
     */
    color?: 'error' | 'info' | 'primary' | 'success' | 'warning';

    /**
     * The size of the button.
     */
    size?: 'large' | 'medium' | 'small';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => (
        <button
            ref={ref}
            type="button"
            {...props}
        />
    ),
);

Button.displayName = 'Button';
