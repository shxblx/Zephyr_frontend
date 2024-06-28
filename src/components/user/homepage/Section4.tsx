import React, { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
}

const Section4: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Epic Games Reveals New Fortnite Season",
      excerpt:
        "Epic Games has unveiled the details for the next season of Fortnite, introducing new gameplay mechanics, character skins, and map changes. Players can expect a fresh battle pass, weekly challenges, and limited-time modes to keep the action intense.",
      date: "2024-06-29",
    },
    {
      id: 2,
      title: "NVIDIA Launches RTX 3080 Ti Graphics Card",
      excerpt:
        "NVIDIA has released the RTX 3080 Ti, a high-performance graphics card designed for gamers and content creators. With its advanced ray tracing capabilities and high refresh rate support, the RTX 3080 Ti promises to deliver immersive gaming experiences.",
      date: "2024-06-28",
    },
    {
      id: 3,
      title: "Ubisoft Announces Far Cry 6 DLC",
      excerpt:
        "Following the success of Far Cry 6, Ubisoft has announced a series of downloadable content packs. These expansions will introduce new storylines, characters, and maps, offering players extended gameplay and additional challenges.",
      date: "2024-06-27",
    },
    {
      id: 4,
      title: "Steam Summer Sale Kicks Off",
      excerpt:
        "The highly anticipated Steam Summer Sale is now live, featuring thousands of games discounted up to 75%. Gamers can find deals on recent releases, classic titles, and everything in between, perfect for expanding their game libraries.",
      date: "2024-06-26",
    },
    {
      id: 5,
      title: "League of Legends World Championship Finals",
      excerpt:
        "The League of Legends World Championship finals are set to take place this weekend, with teams competing for the prestigious Summoner's Cup. Fans worldwide are tuning in to watch the top esports athletes clash in this year's grand finale.",
      date: "2024-06-25",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 px-4 relative">
      <h2 className="text-4xl font-bold text-center mb-12 font-orbitron text-ff5f09">
        Latest News
      </h2>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex space-x-8 overflow-x-scroll scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-96 h-[350px] bg-white  shadow-lg p-8 flex flex-col"
            >
              <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{item.excerpt}</p>
              <p className="text-sm text-gray-500">{item.date}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition duration-300"
        >
          <ChevronLeftIcon className="h-8 w-8 text-ff5f09" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition duration-300"
        >
          <ChevronRightIcon className="h-8 w-8 text-ff5f09" />
        </button>
      </div>
    </section>
  );
};

export default Section4;
