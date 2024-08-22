import React from 'react';

interface CheckboxPropsInterface {
    name: string;
    color: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type { CheckboxPropsInterface };
