const Card = ({ children, className = '', as: Tag = 'div', ...props }) => (
  <Tag
    className={`glass rounded-xl2 shadow-glow p-5 sm:p-6 ${className}`}
    {...props}
  >
    {children}
  </Tag>
);

export default Card;
