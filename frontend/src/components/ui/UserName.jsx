import CrownIcon from "../../assets/icons/CrownIcon.jsx";

const CROWN_EMAIL = "galib.savar@gmail.com";

const UserName = ({ name, email, className = "" }) => {
  const hasCrown = email?.toLowerCase() === CROWN_EMAIL;

  return (
    <span className={`inline-flex items-center gap-gap-small ${className}`}>
      {name}
      {hasCrown && (
        <CrownIcon
          width={20}
          height={18}
          className="shrink-0"
          aria-label="Crown member"
        />
      )}
    </span>
  );
};

export default UserName;
