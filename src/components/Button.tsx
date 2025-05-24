export const Button = ({ title, onClick }) => {
  return (
    <button
      type="submit"
      style={{
        width: '100%',
        padding: '10px 0',
        borderRadius: 6,
        border: 'none',
        background: '#2563eb',
        color: '#fff',
        fontWeight: 600,
        fontSize: 16,
        cursor: 'pointer',
        marginBottom: 12,
      }}
      onClick={onClick}>
      {title}
    </button>
  );
};
