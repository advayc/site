import React, { useState, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { Inter } from "next/font/google";
import { useTerminal } from './TerminalContext';
import Link from '@/components/Link';

interface Project {
  title: string;
  description: string;
  repoUrl: string;
}

interface TerminalProps {
  onClose: () => void;
  headerText: string;
  pathText: string;
  branchText: string;
  infoText: string;
  projects?: Project[];
}

const inter = Inter({ subsets: ["latin"] });

const Terminal: React.FC<TerminalProps> = ({ onClose, headerText, pathText, branchText, infoText, projects }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHoveringMaximize, setIsHoveringMaximize] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const dragControls = useDragControls();
  const { setIsTerminalOpen, setIsDragging } = useTerminal();

  const handleClose = () => {
    onClose();
    setIsTerminalOpen(false);
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
  };

  const handleMinimize = () => {
    onClose();
    setIsTerminalOpen(false);
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F' || event.key === 'f') {
        handleMaximize();
      } else if (event.key === 'Escape' || event.key === 'C' || event.key === 'c') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMaximized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.detail === 2) {
      setIsDraggable(false);
    }
  };

  const handleMouseUp = () => {
    setIsDraggable(true);
  };

  const renderProjects = () => {
    if (!projects) return null;

    return (
      <div className="mt-4 font-mono text-sm">
        {projects.map((project, index) => (
          <div key={index} className="mb-4">
            <div className="ml-4 mt-2">
                <Link href={project.repoUrl}>{project.title}</Link>
            <div className="text-gray-300 mt-1">{project.description}</div>
          </div>
        </div>
      ))}
    </div>
    );
  };

  return (
    <motion.div
      drag={isDraggable}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className={`terminal-container ${inter.className} transition-all duration-300 ease-in-out ${
        isMinimized
          ? "hidden"
          : isMaximized
          ? "w-[862px] h-[700px]"
          : "w-[600px] h-[400px]"
      } rounded-lg fixed top-16 left-16 z-50 font-mono text-sm border-gray-800 rounded-b-lg`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <motion.div 
        className="flex items-center justify-between bg-zinc-200 text-white px-4 py-1 rounded-t-lg cursor-move"
        onPointerDown={(e) => isDraggable && dragControls.start(e)}
      >
        <div className="flex space-x-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-3 h-3 bg-[#FB5F57] rounded-full hover:bg-red-600 transition-colors duration-200 cursor-pointer"
            onClick={handleClose}
          ></motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-3 h-3 bg-[#FBBD2E] rounded-full hover:bg-amber-600 transition-colors duration-200 cursor-pointer"
            onClick={handleMinimize}
          ></motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-3 h-3 bg-[#29CA40] rounded-full hover:bg-green-600 transition-colors duration-200 cursor-pointer"
            onClick={handleMaximize}
            onMouseEnter={() => setIsHoveringMaximize(true)}
            onMouseLeave={() => setIsHoveringMaximize(false)}
          ></motion.div>
        </div>
        <div className="flex-grow text-center text-black flex items-center justify-center">
          <img src="/directory_closed.png" className="mr-2" alt="Directory" />
          <span className="font-medium text-[13px]">{headerText}</span>
        </div>
      </motion.div>

      <div className="p-4 bg-[#151515] text-primary select-text overflow-y-auto rounded-b-lg" style={{ maxHeight: isMaximized ? "calc(100% - 32px)" : "368px" }}>
        <div className="flex items-center">
          <span className="text-green-400 mr-2">$</span>
          <span className="text-cyan-500 font-semibold">{pathText}</span>
          <span className="text-[#2CCC12] font-semibold ml-2">{branchText}</span>
        </div>
        <div className="flex mt-4">
          <span className="text-green-400 mr-2">$</span>
          <span className="text-yellow-400">echo</span>
          <span className="text-primary ml-2">{infoText}</span>
        </div>
        {renderProjects()}
      </div>
    </motion.div>
  );
};

export default Terminal;
