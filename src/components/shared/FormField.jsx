import React from 'react';

const FormField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    type = 'text', 
    required = false,
    placeholder = '',
    pattern = null,
    maxLength = null,
    min = null,
    max = null,
    options = null,
    className = '',
    style = {}
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && '*'}
            </label>
            {options ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full p-2 border border-gray-300 rounded ${className}`}
                    required={required}
                >
                    <option value="">Select {label.toLowerCase()}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full p-2 border border-gray-300 rounded ${className}`}
                    required={required}
                    placeholder={placeholder}
                    pattern={pattern}
                    maxLength={maxLength}
                    min={min}
                    max={max}
                    style={style}
                />
            )}
        </div>
    );
};

export default FormField;

