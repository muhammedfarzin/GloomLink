import React, { useCallback } from "react";

interface FormBoxProps extends React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> {
  children: React.ReactNode;
  title: string;
  method?: string;
}

const FormBox: React.FC<FormBoxProps> = ({
  children,
  title,
  onSubmit,
  method = "post",
  ...props
}) => {
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      if (onSubmit) {
        e.preventDefault();
        onSubmit(e);
      }
    },
    [onSubmit],
  );

  return (
    <div className="w-full max-w-[450px] mx-auto rounded-2xl p-4 bg-formBox">
      <h3 className="text-center text-3xl font-bold mb-2 text-foreground">
        {title}
      </h3>
      <form method={method} onSubmit={handleSubmit} {...props}>
        {children}
      </form>
    </div>
  );
};

export default FormBox;
