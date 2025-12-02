import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../auth/hook/useAuth";
import Button from "../../shared/components/Button";

function StoreLayout() {
  const [openMenu, setOpenMenu] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const { isAuthenticated, signout, role } = useAuth();

  useEffect(() => {
    // Si el usuario logueado es Admin, no puede estar en el catálogo
    if (role === 'Admin') {
      navigate('/admin/home', { replace: true });
    }
  }, [role, navigate]);

  const logout = () => {
    signout('/'); 
  };

  const getLinkStyles = ({ isActive }) =>
    `
      pl-4 w-full block pt-3 pb-3 rounded-4xl text-sm
      transition hover:bg-gray-100
      ${isActive ? "bg-purple-200 hover:bg-purple-100" : ""}
    `;
  const getLinkStylesDesk = ({ isActive }) =>
    `
     mx-2 block py-2 py-2 rounded-md text-sm
     transition bg-gray-200 hover:bg-gray-300 hidden sm:block
     ${isActive ? "bg-gray-200 hover:bg-gray-400" : ""}
    `;

  //JSX para botones desktop
  const authButtonsDesktop = isAuthenticated ? (
    <Button
      className="hidden sm:inline-flex px-4 py-1 rounded-full bg-neutral-800 text-white text-sm"
      onClick={logout}
    >
      Cerrar sesión
    </Button>
  ) : (
    <div className="hidden sm:flex gap-2">
      <Button
        className="px-4 py-1 rounded-full bg-purple-200 text-xs sm:text-sm"
        onClick={() => navigate("/login")}
      >
        Iniciar sesión
      </Button>
      <Button
        className="px-4 py-1 rounded-full bg-neutral-200 text-xs sm:text-sm"
        onClick={() => navigate("/login")}
      >
        Registrarse
      </Button>
    </div>
  );

  //JSX para botones mobile
  const authButtonsMobile = isAuthenticated ? (
    <Button
      className="block w-full sm:hidden mt-4"
      onClick={() => {
        logout();
        setOpenMenu(false);
      }}
    >
      Cerrar sesión
    </Button>
  ) : (
    <div className="flex flex-col gap-2 mt-4 sm:hidden">
      <Button
        className="w-auto rounded-full bg-purple-200 text-xl font-medium"
        onClick={() => {
          navigate("/login");
          setOpenMenu(false);
        }}
      >
        Iniciar sesión
      </Button>
      <Button
        className="w-auto rounded-full bg-purple-200 text-xl font-medium"
        onClick={() => {
          navigate("/login");
          setOpenMenu(false);
        }}
      >
        Registrarse
      </Button>
    </div>
  );

  return (
    <div>
      <header
        className="
          flex items-center justify-between gap-3
          p-4 shadow rounded bg-white
          sm:col-span-2
        "
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500 text-white text-sm font-bold">
            E
          </span>
          <span className="hidden sm:inline font-semibold text-sm">
            ElectroHogar
          </span>
        </button>

        <ul className="flex flex-row justify-center w-auto">
          <li>
            <NavLink to="/" end className={getLinkStylesDesk}>
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className={getLinkStylesDesk}>
              Carrito de compras
            </NavLink>
          </li>
        </ul>

        <div className="flex-1 flex justify-center mb-2 pb-2 md:pb-0 md:mb-0">
          <div className="w-full max-w-xs md:max-w-md">
            <input
              type="text"
              placeholder="Bucador de productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                border border-neutral-200
                rounded-full
                text-xs sm:text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-400
              "
            />
          </div>
        </div>

        {/* Botones desktop */}
        {authButtonsDesktop}

        {/* Botón menú mobile */}
        <button
          className="
            bg-transparent border-none shadow-none
            sm:hidden
          "
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? <span>&#215;</span> : <span>&#9776;</span>}
        </button>
      </header>

      <aside
        className={`
          absolute top-0 bottom-0
          bg-white w-64 py-6 px-3
          rounded shadow flex flex-col justify-between
          transition-all duration-300
          ${openMenu ? "left-0" : "left-[-256px]"}
          sm:relative sm:left-0 sm:top-auto sm:bottom-auto sm:hidden
        `}
      >
        <nav>
          <ul className="flex flex-col">
            <li>
              <NavLink to="/" end className={getLinkStyles}>
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className={getLinkStyles}>
                Carrito de compras
              </NavLink>
            </li>
          </ul>

          <hr className="opacity-15 mt-4" />

          {authButtonsMobile}
        </nav>
      </aside>

      <main>
      <Outlet context={{ search }} />
      </main>
    </div>
  );
}

export default StoreLayout;
