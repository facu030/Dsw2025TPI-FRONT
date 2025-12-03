function Input({ label, error = "", ...restProps }) {
  return (
    <div
      className="
    w-full       
    flex
    flex-col
    gap-3         
    sm:gap-5     
    py-2          
  "
    >
      <label>{label}:</label>
      <input className={error && "border-red-400"} {...restProps} />
      {error && <p className="text-red-500 text-base sm:text-xs">{error}</p>}
    </div>
  );
}

export default Input;
