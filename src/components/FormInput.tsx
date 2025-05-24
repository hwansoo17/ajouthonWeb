type InputProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
};
export const FormInput: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
}) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', marginBottom: 6 }}>
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 12px',
          marginTop: 4,
          borderRadius: '6px',
          border: '1px solid #27272a',
          background: '#18181b',
          color: '#f4f4f5',
          outline: 'none',
        }}
      />
    </label>
  </div>
);
