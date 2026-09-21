const CrownIcon = ({ width = 119, height = 108, className = "", ...props }) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 119 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M31.8017 0.682553L59.5 36.8579H3.41954L31.8017 0.682553Z"
        fill="#CFB523"
      />
      <path
        d="M89.25 0.682553L116.948 36.8579H60.8678L89.25 0.682553Z"
        fill="#CFB523"
      />
      <path
        d="M0 87.7081V2.03866L30.1219 38.055L59.8719 0L88.1344 38.055L119 2.03866V87.7081C119 87.7081 101.037 99.2083 88.1344 103.066C66.4319 109.554 51.769 109.735 30.1219 103.066C17.5003 99.1767 0 87.7081 0 87.7081Z"
        fill="#EACB19"
      />
    </svg>
  );
};

export default CrownIcon;
