import { Routes, Route } from "react-router-dom";
import NavLink from "./lib/NavLink";
import Home from "./pages/home";
import RenamePage from "./pages/rename";
import theme from "./lib/theme";

function App() {
  return (
    <div className="">
      <nav className={`p-4 ${theme.appColor}`}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/rename/videos">Rename Videos</NavLink>
        <NavLink to="/rename/comics">Rename Comics</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rename/videos" element={<RenamePage mediaType="videos" />} />
        <Route path="/rename/comics" element={<RenamePage mediaType="comics" />} />
      </Routes>
    </div>
  );
}

export default App;
