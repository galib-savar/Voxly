import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext.jsx";
import Button from "../ui/Button.jsx";
import SunIcon from "../../assets/icons/SunIcon.jsx";
import MoonIcon from "../../assets/icons/MoonIcon.jsx";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (prefersDark) return null;

  return (
    <Button onClick={toggleTheme}>
      {theme === "light" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ThemeToggle;
