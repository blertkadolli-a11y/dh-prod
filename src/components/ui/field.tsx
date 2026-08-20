import type { ChangeEvent, FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface BaseProps {
    id: string
    label: string
    value: string
    error?: string
    required?: boolean
    onChange: (value: string) => void
}

const shell =
    'w-full rounded-2xl border bg-background px-5 py-4 text-base text-foreground transition-colors duration-300 ' +
    'placeholder:text-foreground/25 focus-visible:border-primary focus-visible:outline-none'

const Wrapper: FC<{ id: string; label: string; required?: boolean; error?: string; children: ReactNode }> = ({
    id, label, required, error, children
}) => (
    <div className='flex flex-col gap-2'>
        <label htmlFor={id} className='type-meta text-foreground/45'>
            {label}
            {required && <span aria-hidden='true' className='ml-1 text-primary-bright'>*</span>}
        </label>

        {children}

        {/* Tied to the input via aria-describedby so screen readers announce it. */}
        {error && (
            <span id={`${id}-error`} role='alert' className='type-meta text-primary-bright'>
                {error}
            </span>
        )}
    </div>
)

export const TextField: FC<BaseProps & { type?: string; placeholder?: string }> = ({
    id, label, value, error, required, onChange, type = 'text', placeholder
}): ReactNode => (
    <Wrapper id={id} label={label} required={required} error={error}>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            placeholder={placeholder}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
            className={cn(shell, error ? 'border-primary' : 'border-border')}
        />
    </Wrapper>
)

export const TextArea: FC<BaseProps & { placeholder?: string; rows?: number }> = ({
    id, label, value, error, required, onChange, placeholder, rows = 5
}): ReactNode => (
    <Wrapper id={id} label={label} required={required} error={error}>
        <textarea
            id={id}
            name={id}
            rows={rows}
            value={value}
            placeholder={placeholder}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
            className={cn(shell, 'resize-y', error ? 'border-primary' : 'border-border')}
        />
    </Wrapper>
)

export const SelectField: FC<BaseProps & { options: { value: string; label: string }[] }> = ({
    id, label, value, error, required, onChange, options
}): ReactNode => (
    <Wrapper id={id} label={label} required={required} error={error}>
        <select
            id={id}
            name={id}
            value={value}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
            className={cn(shell, 'cursor-pointer appearance-none', error ? 'border-primary' : 'border-border')}
        >
            {options.map(option => (
                <option key={option.value} value={option.value} className='bg-card'>
                    {option.label}
                </option>
            ))}
        </select>
    </Wrapper>
)
