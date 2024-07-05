import OrangeButton from "../../common/user/OrangeButton";
import WhiteButton from "../../common/user/WhiteButton";

const Section1 = () => {
  return (
    <section className="flex flex-col md:flex-row h-auto md:h-80">
      <div className="md:w-1/3 bg-ff5f09 flex flex-col items-center justify-center p-4 relative">
        <div className="flex flex-col items-center justify-center flex-grow">
          <p className="text-white font-extrabold text-center text-3xl font-orbitron mb-4">
            Unite with gamers. Become part of the community!
          </p>
        </div>
        <div className="font-orbitron font-bold mt-4 md:absolute bottom-8 right-4">
          <WhiteButton
            color="#fff"
            hoverFontColor="#ff5f09"
            px={20}
            py={10}
            value="Join Now!"
          />
        </div>
      </div>

      <div className="md:w-2/3 bg-white flex items-center flex-col justify-center p-8 relative">
        <p className="text-ff5f09 text-center text-3xl font-extrabold font-orbitron mb-8">
          From pixels to pals
          <br />
          Connect with fellow gamers and create legendary friendships!
        </p>
        <div className="font-orbitron font-bold mt-4 md:absolute bottom-8 left-4 ">
          <OrangeButton color="#FF5F09" px={20} py={10} value="Connect" />
        </div>
      </div>
    </section>
  );
};

export default Section1;
