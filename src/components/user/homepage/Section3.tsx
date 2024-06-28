import React, { useState } from 'react';
import { faRobot, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TrophyIcon } from "@heroicons/react/24/outline";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const Section3: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const renderBox = (index: number, icon: React.ReactNode, text: string) => (
    <div className="md:w-1/4 flex items-center justify-center md:flex-col">
      <div
        className="border-2 border-white p-2 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ease-in-out"
        style={{ width: "80%", height: "90%" }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div
          className="absolute inset-0 bg-white transition-all duration-300 ease-in-out"
          style={{
            transform: `translateY(${hoveredIndex === index ? '0%' : '-100%'})`,
          }}
        />
        <div 
          className={`relative z-10 transition-all duration-300 ${hoveredIndex === index ? 'text-ff5f09 scale-125' : 'text-ff5f09'}`}
        >
          {icon}
        </div>
        <p className={`relative z-10 text-xl md:text-2xl text-center font-bold font-orbitron mt-2 transition-colors duration-300 ${hoveredIndex === index ? 'text-ff5f09' : 'text-white'}`}>
          {text.split('<br/>').map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </p>
      </div>
    </div>
  );

  return (
    <section className="flex flex-col md:flex-row h-auto md:h-96 border-2 border-white p-4">
      {renderBox(0, <ChatBubbleLeftRightIcon className="h-12 md:h-24" />, "Instant messaging<br/>voice, and video calls.")}
      {renderBox(1, <FontAwesomeIcon className="h-12 md:h-24" icon={faUsers} />, "Create custom<br/>servers and channels.")}
      {renderBox(2, <FontAwesomeIcon className="h-12 md:h-24" icon={faRobot} />, "Your own<br/>Assistant")}
      {renderBox(3, <TrophyIcon className="h-12 md:h-24" />, "Create your own<br/>tournaments")}
    </section>
  );
};

export default Section3;