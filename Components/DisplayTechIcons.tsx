import React from 'react'
import Image from "next/image";
import {cn, getTechLogos} from "@/lib/utils";

const DisplayTechIcons = async ({techStack}: TechIconProps) => {

    const techIcons = await getTechLogos(techStack);

    return (
        <div className = " flex flex-row">
            {techIcons.slice(0,4).map(({tech, url}, index) =>(
                <div
                    key={tech}
                    className={cn(
                        "relative group rounded-full p-2 flex flex-center bg-gradient-to-r from-purple-350 to-pink-400",
                        index >= 1 && "-ml-2"
                    )}>

                    <span className =" tech-tooltip">
                        {tech}
                    </span>

                    <Image
                        src={url}
                        alt ={tech}
                        width={100} height={100}
                        className ="size-5"/>

                </div>

                ))}
        </div>
    );
};
export default DisplayTechIcons
