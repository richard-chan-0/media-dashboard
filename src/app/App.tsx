import { Routes, Route } from "react-router-dom";
import NavLink from "./lib/components/NavLink";
import pages from "./pages/pages";
import theme from "./lib/theme";

function App() {
  return (
    <div className="">
      <nav className={`flex flex-wrap p-4 ${theme.appColor}`}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/rename/videos">Rename Videos</NavLink>
        <NavLink to="/rename/comics">Rename Comics</NavLink>
        <NavLink to="/volumes">Create Volumes</NavLink>
        <NavLink to="/ffmpeg">Reset Default Streams</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<pages.Home />} />
        <Route path="/rename/videos" element={<pages.RenamePage mediaType="videos" />} />
        <Route path="/rename/comics" element={<pages.RenamePage mediaType="comics" />} />
        <Route path="/volumes" element={<pages.ManagePage />} />
        <Route path="/ffmpeg" element={<pages.FfmpegPage />} />
      </Routes>
    </div >
  );
}

export default App;
