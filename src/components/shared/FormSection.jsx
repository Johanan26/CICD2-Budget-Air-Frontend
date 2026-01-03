import React from 'react';

const FormSection = ({ title, children, onSubmit, onCancel, submitLabel, cancelLabel = 'Cancel', loading = false, submitButtonColor = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300',
        green: 'bg-green-600 hover:bg-green-700 disabled:bg-green-300',
    };

    return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            {title && (
                <h4 className="text-lg font-bold mb-4">{title}</h4>
            )}
            <form onSubmit={onSubmit} className="space-y-4">
                {children}
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`${colorClasses[submitButtonColor]} text-white px-6 py-2 rounded font-semibold transition-colors`}
                    >
                        {loading ? 'Saving...' : submitLabel}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-semibold hover:bg-gray-300 transition-colors"
                        >
                            {cancelLabel}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default FormSection;

