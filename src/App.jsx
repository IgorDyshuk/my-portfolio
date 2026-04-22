import HomeSection from "./Sections/HomeSection";
import AboutSection from "./Sections/AboutSection";

function App() {
  return (
    <div className="px-5 sm:px-0 mx-auto w-full max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-4xl">
      <HomeSection />
      <AboutSection />
      <div className="h-200 w-full border-red-500 border-2" />
    </div>
  );
}

export default App;
