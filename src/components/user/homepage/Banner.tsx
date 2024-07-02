import { Link } from "react-router-dom";
import OrangeButton from "../../common/OrangeButton";

export const Banner = () => {
  return (
    <section className="bg-black text-white flex flex-col items-center justify-center h-screen relative">
      <div className="absolute top-1/4 md:top-32 lg:top-40 flex flex-col items-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-orbitron mb-4">
          Your Gaming Universe
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium font-orbitron">
          All in One Place!
        </p>
      </div>
      <div className="mt-20 text-3xl font-orbitron font-bold">
        <Link to="/home">
          <OrangeButton px={80} py={20} value="Enter Now" />
        </Link>
      </div>
    </section>
  );
};
