import { Routes, Route } from "react-router-dom";
import NavLink from "./lib/components/NavLink";
import pages from "./pages/pages";
import theme from "./lib/theme";

function App() {
    return (
        <div>
            <nav className={`flex flex-wrap gap-1 p-2 ${theme.appColor}`}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/rename/videos">Rename Videos</NavLink>
                <NavLink to="/rename/comics">Rename Comics</NavLink>
                <NavLink to="/volumes">Create Volumes</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<pages.Home />} />
                <Route
                    path="/rename/videos"
                    element={<pages.RenamePage mediaType="videos" />}
                />
                <Route
                    path="/rename/comics"
                    element={<pages.RenamePage mediaType="comics" />}
                />
                <Route path="/volumes" element={<pages.ManagePage />} />
            </Routes>
        </div>
    );
}

export default App;
