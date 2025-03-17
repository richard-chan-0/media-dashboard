import { Link } from "react-router-dom";

interface NavLinkProps {
    to: string,
    children: React.ReactNode
}

const NavLink = ({ to, children }: NavLinkProps) => {
    return (
        <Link
            to={to}
            className="border rounded-xl p-1 m-1 bg-gray-200 hover:bg-gray-300 active:bg-blue-300 text-blue-600 text-sm w-1/8 text-wrap content-center text-center"
        >
            {children}
        </Link>
    )
}

export default NavLink;