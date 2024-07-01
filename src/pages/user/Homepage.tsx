import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";
import { Banner } from "../../components/user/homepage/Banner";
import Section1 from "../../components/user/homepage/Section1";
import Section2 from "../../components/user/homepage/Section2";
import Section3 from "../../components/user/homepage/Section3";
import Section4 from "../../components/user/homepage/Section4";

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
