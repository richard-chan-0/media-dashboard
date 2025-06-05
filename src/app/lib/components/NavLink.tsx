import { Link } from "react-router-dom";
import theme from "../theme";

interface NavLinkProps {
    to: string;
    children: React.ReactNode;
}

const NavLink = ({ to, children }: NavLinkProps) => {
    return (
        <Link
            to={to}
            className={`${theme.shadowBorderHover} border rounded-xl p-1 m-1  active:bg-blue-300 text-white text-sm w-1/8 text-wrap content-center text-center`}
        >
            {children}
        </Link>
    );
};

export default NavLink;
