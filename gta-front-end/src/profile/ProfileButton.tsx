import { useEffect, useRef, useState } from "react";
import profile from "./profile.module.scss";
import auth from "../services/auth";
import { useNavigate } from "react-router-dom";
import { addAuthDataInSessionStorage, useUser } from "../hooks/useAuth";

export const ProfileButton = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const { mutate: fetchUser } = useUser();
  const [user, setUser] = useState({
    email: sessionStorage.getItem("auth-email"),
    id: sessionStorage.getItem("auth-id"),
    isActivated: sessionStorage.getItem("auth-isActivated") === "true",
    roleName: [] as string[],
  });

  useEffect(() => {
    if (!user.email) {
      console.log(user);
      fetchUser(undefined, {
        onSuccess(data) {
          setUser({
            email: data.email,
            id: data.id,
            isActivated: data.isActivated,
            roleName: data.roleName,
          });

          addAuthDataInSessionStorage(data)
        },
      });
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutsideMenu = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !buttonRef.current?.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const handlerLogout = async () => {
    await auth.logout();
    navigate("/login");
    localStorage.removeItem("accessToken");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu);

    return () =>
      document.removeEventListener("mousedown", handleClickOutsideMenu);
  }, []);

  return (
    <div className={profile.Profile}>
      <div
        ref={buttonRef}
        className={profile.profile_wrapper}
        onClick={toggleDropdown}
      >
        <div>{user.email && user.email.charAt(0).toUpperCase()}</div>
      </div>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-12 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
        >
          <div className="py-2">
            <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              Profile
            </div>
            <div
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={handlerLogout}
            >
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
