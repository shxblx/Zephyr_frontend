import Footer from "../../common/Footer";
import Navbar from "../../common/Navbar";
import { Banner } from "./Banner";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";

export const Homepage = () => {
  return (
    <>
      <Navbar />
      <Banner />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Footer />
    </>
  );
};
