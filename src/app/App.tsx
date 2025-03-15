import { Routes, Route } from "react-router-dom";
import NavLink from "./lib/components/NavLink";
import Home from "./pages/home";
import RenamePage from "./pages/rename";
import theme from "./lib/theme";
import ManagePage from "./pages/manage";

function App() {
  return (
    <div className="">
      <nav className={`flex flex-wrap p-4 ${theme.appColor}`}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/rename/videos">Rename Videos</NavLink>
        <NavLink to="/rename/comics">Rename Comics</NavLink>
        <NavLink to="/volumes">Create Volumes</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rename/videos" element={<RenamePage mediaType="videos" />} />
        <Route path="/rename/comics" element={<RenamePage mediaType="comics" />} />
        <Route path="/volumes" element={<ManagePage />} />
      </Routes>
    </div>
  );
}

export default App;
