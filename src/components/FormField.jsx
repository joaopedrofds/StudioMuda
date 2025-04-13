import React from "react";
import PropTypes from "prop-types";

function FormField({ label, type = "text", placeholder, register, error, options }) {
  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition duration-200">
        {label}
      </label>
      {type === "select" ? (
        <select
          {...register}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
        >
          <option value="">Selecione</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value} className="text-gray-900">
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          {...register}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
        />
      )}
      {error && <span className="text-red-500 text-sm mt-1 animate-pulse">{error}</span>}
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  register: PropTypes.object.isRequired,
  error: PropTypes.string,
};

export default FormField;
