type ButtonProps = {
  iconClass: string;
  spanClasses?: string;
  buttonClasses?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  iconClass: iconClasses,
  buttonClasses,
  spanClasses,
  onClick,
  children,
}) => {
  return (
    <button
      className={`button is-primary is-small ${buttonClasses}`}
      onClick={onClick}
    >
      <span className={`icon ${spanClasses}`}>
        <i className={`fas + ${iconClasses}`} />
      </span>
      <span>{children}</span>
    </button>
  );
};
export default Button;
