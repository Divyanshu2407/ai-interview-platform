"use client";

import React from "react";
import Image from "next/image";
import { cn, getTechLogos } from "@/lib/utils";

interface IconEntry {
    tech: string;
    url: string;
}

interface DisplayTechIconsProps {
    // Accept precomputed icons OR a simple tech stack array for convenience.
    techIcons?: IconEntry[];
    techStack?: string[];
}

const DisplayTechIcons = ({ techIcons, techStack }: DisplayTechIconsProps) => {
    const icons: IconEntry[] = techIcons && techIcons.length > 0 ? techIcons : getTechLogos(techStack || []);

    if (!icons || icons.length === 0) return null;

    return (
        <div className="flex flex-row">
            {icons.slice(0, 4).map(({ tech, url }, index) => (
                <div
                    key={tech + index}
                    className={cn(
                        "relative group rounded-full p-2 flex flex-center bg-gradient-to-r from-purple-300 to-pink-400",
                        index >= 1 && "-ml-3"
                    )}
                >
                    <span className="tech-tooltip">{tech}</span>
                    <Image src={url} alt={tech} width={100} height={100} className="size-5" />
                </div>
            ))}
        </div>
    );
};

export default DisplayTechIcons;
