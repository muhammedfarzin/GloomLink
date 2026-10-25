interface FieldErrorProps {
  message?: string;
}

const FieldError: React.FC<FieldErrorProps> = ({ message }) =>
  message ? (
    <p role="alert" className="text-left text-xs text-red-500 -mt-1 mb-2">
      {message}
    </p>
  ) : null;

export default FieldError;
