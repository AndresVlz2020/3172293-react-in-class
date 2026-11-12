import { useEffect, useState } from "react";
import {
  IconButton,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  SearchField,
} from "@/shared";
import logo from "@/assets/images/1-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { logout } from "@/features/auth/services/logoutService";
import { hasPermission } from "@/features/access/services/accessService";

export default function Navbar() {
  // Componente de búsqueda 😂😂😂
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Estado de permisos del usuario actual
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user") || "null");
      return Boolean(storedUser?.isAdmin || storedUser?.isSuperuser);
    } catch {
      return false;
    }
  });
  const [canListUsers, setCanListUsers] = useState(false);
  const [canCreateUsers, setCanCreateUsers] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    let isMounted = true;

    Promise.all([
      hasPermission("admin"),
      hasPermission("list_user"),
      hasPermission("create_user"),
    ])
      .then(([adminRes, listRes, createRes]) => {
        if (!isMounted) return;

        setIsAdmin(Boolean(adminRes?.granted));
        setCanListUsers(Boolean(listRes?.granted));
        setCanCreateUsers(Boolean(createRes?.granted));
      })
      .catch(() => {
        if (!isMounted) return;

        setIsAdmin(false);
        setCanListUsers(false);
        setCanCreateUsers(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (value) => {
    console.log("Buscar:", value);
  };

  const handleClear = () => {
    console.log("Campo limpiado");
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="w-full bg-transparent border-b-2">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo de marca */}
          <div className=" hidden sm:block items-center">
            <Link to={"/home"} className="text-h1 font-heading">
              <img src={logo} alt="logo" className="h-12" />
            </Link>
          </div>

          {/* Links de navegación */}
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <Link to={"/home"} className="hover:text-primary transition">
                Inicio
              </Link>
            </li>
            {(isAdmin || canCreateUsers) && (
              <li>
                <Link
                  to={"/dashboard"}
                  className="hover:text-primary transition"
                >
                  Registro
                </Link>
              </li>
            )}
            {(isAdmin || canListUsers) && (
              <li>
                <Link
                  to={"/dashboard/userList"}
                  className="hover:text-primary transition"
                >
                  Usuarios
                </Link>
              </li>
            )}
            <li>
              <Link to={"/home"} className="hover:text-primary transition">
                Productos
              </Link>
            </li>
          </ul>

          {/* SearchField */}
          <div className="flex items-center gap-2">
            <SearchField
              value={search}
              onChange={setSearch}
              onSubmit={handleSearch}
              onClear={handleClear}
              placeholder="Buscar productos..."
              size="md"
              variant="outlined"
              className="w-72"
            />

            {/* Dropdown */}
            <Dropdown>
              <div>
                <DropdownTrigger>
                  <IconButton ariaLabel="Menu">
                    <Menu />
                  </IconButton>
                </DropdownTrigger>
              </div>

              {/* Contenido */}
              <DropdownContent className="right-0">
                {isAdmin && (
                  <DropdownItem onClick={() => navigate("/dashboard/access")}>
                    Admin
                  </DropdownItem>
                )}
                {(isAdmin || canCreateUsers) && (
                  <DropdownItem onClick={() => navigate("/dashboard")}>
                    Gestión de usuarios
                  </DropdownItem>
                )}
                {(isAdmin || canListUsers) && (
                  <DropdownItem onClick={() => navigate("/dashboard/userList")}>
                    Listar usuarios
                  </DropdownItem>
                )}
                <DropdownItem onClick={() => navigate("/home")}>
                  Gestión de productos
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  Cerrar sesión
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
}
