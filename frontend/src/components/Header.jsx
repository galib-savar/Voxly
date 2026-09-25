import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import HomeIcon from "../assets/icons/HomeIcon.jsx";
import UserIcon from "../assets/icons/UserIcon.jsx";
import SettingIcon from "../assets/icons/SettingIcon.jsx";
import Button from "./ui/Button.jsx";
import Image from "./ui/Image.jsx";
import Popup from "./ui/Popup.jsx";
import SignUp from "./Popup/SignUp.jsx";
import SignIn from "./Popup/SignIn.jsx";
import { getProfile } from "../api/profile.js";
import { getCookie } from "../utils/getCookie.js";
import UserName from "./ui/UserName.jsx";
import SignUpIcon from "../assets/icons/SignUpIcon.jsx";
import SignInIcon from "../assets/icons/SignInIcon.jsx";

const Header = () => {
  const [activePopup, setActivePopup] = useState(null);
  const [user, setUser] = useState(() => {
    if (!getCookie("token")) return null;
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [isMenuOpen, setIsMenuOpen] = useState(() => {
    if (window.innerWidth < 768) {
      return false;
    } else {
      try {
        const savedMenuState = localStorage.getItem("menuOpen");
        return savedMenuState === null ? true : JSON.parse(savedMenuState);
      } catch {
        return true;
      }
    }
  });

  useEffect(() => {
    localStorage.setItem("menuOpen", JSON.stringify(isMenuOpen));
  }, [isMenuOpen]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const userId = user?._id;
    if (!userId) return;

    let isCurrent = true;

    getProfile(userId).then((profile) => {
      if (isCurrent && profile) {
        setUser((currentUser) => ({ ...currentUser, profile }));
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [user?._id]);

  const toggleMenu = () => {
    setIsMenuOpen((previous) => !previous);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  return (
    <header
      className={`h-screen p-padding-large flex flex-col justify-between gap-gap-large sticky top-0 Transition Border-Right ${isMenuOpen ? "w-72" : "w-20"}`}
    >
      <section
        className={`flex items-center gap-gap-small ${isMenuOpen ? "p-padding-large" : "justify-center"}`}
      >
        <Image
          onClick={() => (window.innerWidth > 768 ? toggleMenu() : null)}
          src="/Logo.svg"
          alt="Voxly logo"
          width={45}
          height={45}
          className="Logo block cursor-pointer"
        />
        {isMenuOpen && <h2>Voxly</h2>}
      </section>
      <nav className="flex-1">
        <ul className="flex flex-col gap-gap-large">
          <li>
            <NavLink
              to="/"
              className={`NavLinks ${isMenuOpen ? "" : "icon"}`}
              end
            >
              <HomeIcon />
              {isMenuOpen && "Home"}
            </NavLink>
          </li>
          {getCookie("token") && (
            <>
              <li>
                <NavLink
                  to="/profile"
                  className={`NavLinks ${isMenuOpen ? "" : "icon"}`}
                >
                  <UserIcon />
                  {isMenuOpen && "Profile"}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  className={`NavLinks ${isMenuOpen ? "" : "icon"}`}
                >
                  <SettingIcon />
                  {isMenuOpen && "Settings"}
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      {user && isMenuOpen ? (
        <section className="flex items-center gap-gap-small Border p-padding-large rounded-radius">
          {user.profile?.profileLogo ? (
            <Image
              src={user.profile.profileLogo}
              alt={user.name || "User"}
              width={48}
              height={48}
              className="rounded-radius"
            />
          ) : (
            <span className="bg-foreground text-background rounded-radius text-2xl w-12 h-12 flex items-center justify-center">
              {user.name?.charAt(0)}
            </span>
          )}
          <UserName name={user.name} email={user.email} />
        </section>
      ) : (
        <section className="flex flex-col gap-gap-large">
          <Button onClick={() => setActivePopup("signup")}>
            {isMenuOpen ? "Sign Up" : <SignUpIcon />}
          </Button>

          <Button onClick={() => setActivePopup("signin")}>
            {isMenuOpen ? "Sign In" : <SignInIcon />}
          </Button>
        </section>
      )}
      <Popup open={activePopup !== null} onClose={closePopup}>
        {activePopup === "signup" ? (
          <SignUp onClose={closePopup} onSuccess={setUser} />
        ) : (
          <SignIn onClose={closePopup} onSuccess={setUser} />
        )}
      </Popup>
    </header>
  );
};

export default Header;
