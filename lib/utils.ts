import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { interviewCovers, mappings } from "@/constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
    if (!tech) return "";
    const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
    return mappings[key as keyof typeof mappings] || key;
};

export const getTechLogos = (techArray: string[]) => {
    if (!Array.isArray(techArray)) return [];

    return techArray.map((tech) => {
        const normalized = normalizeTechName(tech);
        return {
            tech,
            url: normalized
                ? `${techIconBaseURL}/${normalized}/${normalized}-original.svg`
                : "/tech.svg",
        };
    });
};

export const getInterviewCover = (id: string) => {
    if (!id) {
        const fallbackIndex = Math.floor(Math.random() * interviewCovers.length);
        return `/covers${interviewCovers[fallbackIndex]}`;
    }

    const index =
        id.split("")
            .map((c) => c.charCodeAt(0))
            .reduce((sum, code) => sum + code, 0) % interviewCovers.length;

    return `/covers${interviewCovers[index]}`;
};

export const getRandomInterviewCover = () => {
    const fallbackIndex = Math.floor(Math.random() * interviewCovers.length);
    return `/covers${interviewCovers[fallbackIndex]}`;
};