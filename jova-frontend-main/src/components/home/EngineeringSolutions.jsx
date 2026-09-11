import React from 'react';

const EngineeringSolutions = () => {
    return (
        <section className="relative w-full min-h-[600px] bg-slate-50 flex items-center justify-between px-8 md:px-16 py-12 overflow-hidden font-sans border-b border-slate-200">
            {/* Structural Background Pattern (Replacing the heavy dark tiles) */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-transparent via-slate-100/50 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

                {/* Left Side: Text Content */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                    <span className="text-xs font-bold tracking-widest text-orange-600 uppercase">
                        Premium Capabilities
                    </span>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Engineering <br />
                        Steel <br />
                        Solutions
                    </h1>

                    <p className="text-sm md:text-base text-slate-600 max-w-md leading-relaxed font-normal">
                        Delivering high-precision fabrication, structural integrity, and cutting-edge engineering solutions designed to anchor massive industrial infrastructures.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 pt-4">
                        <button className="px-8 py-3 bg-orange-600 text-white font-medium text-sm rounded shadow-md hover:bg-orange-700 transition duration-200 ease-in-out uppercase tracking-wider">
                            Learn More
                        </button>
                        <button className="px-8 py-3 border border-slate-300 text-slate-700 font-medium text-sm rounded hover:bg-slate-100 transition duration-200 ease-in-out uppercase tracking-wider">
                            Leat More
                        </button>
                    </div>
                </div>

                {/* Right Side: 3D Asset Display Area */}
                <div className="lg:col-span-7 flex justify-center items-center relative min-h-[400px]">
                    {/* Subtle warm ember/particle accents to mimic the image's atmosphere */}
                    <div className="absolute w-72 h-72 bg-orange-200/40 rounded-full blur-3xl -z-10 animate-pulse" />

                    {/* 
            Placeholder for your Three.js Canvas / 3D Module 
            This matches the exact placement of the cross-beam structural steel element in image_6e1d38.jpg
          */}
                    <div className="w-full max-w-lg aspect-square flex items-center justify-center border border-dashed border-slate-300 rounded-xl bg-white/80 shadow-sm backdrop-blur-sm p-8 group hover:border-orange-400 transition-colors duration-300">
                        <div className="text-center space-y-2">
                            <div className="text-slate-400 font-medium group-hover:text-orange-600 transition-colors">
                                [ Insert 3D Steel Cross-Beam Model Here ]
                            </div>
                            <p className="text-xs text-slate-400 max-w-xs">
                                Integrate your 3D component or canvas layer matching the structural node from image_6e1d38.jpg.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default EngineeringSolutions;