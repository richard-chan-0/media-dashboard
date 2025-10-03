import { Routes, Route } from "react-router-dom";
import NavLink from "./lib/components/NavLink";
import Pages from "./pages/Pages";
import theme from "./lib/theme";
import { COMICS, VIDEOS } from "./lib/constants";

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
                <Route path="/" element={<Pages.Home />} />
                <Route
                    path="/rename/videos"
                    element={<Pages.RenamePage mediaType={VIDEOS} />}
                />
                <Route
                    path="/rename/comics"
                    element={<Pages.RenamePage mediaType={COMICS} />}
                />
                <Route path="/volumes" element={<Pages.ManagePage />} />
            </Routes>
        </div>
    );
}

export default App;
