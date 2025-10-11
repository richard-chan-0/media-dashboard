import { Routes, Route } from "react-router-dom";
import NavLink from "./lib/components/NavLink";
import Pages from "./pages/Pages";
import theme from "./lib/theme";

function App() {
    return (
        <>
            <nav className={`flex flex-wrap gap-1 p-2 ${theme.appColor}`}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/rename/">Rename</NavLink>
                <NavLink to="/volumes">Create Volumes</NavLink>
            </nav>
            <div className="h-full w-full">
                <Routes>
                    <Route path="/" element={<Pages.Home />} />
                    <Route
                        path="/rename/"
                        element={<Pages.RenamePage />}
                    />
                    <Route path="/volumes" element={<Pages.ManagePage />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
