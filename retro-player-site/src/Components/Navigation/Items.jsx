import React from 'react'

export default function Items({ index, set, icon, text, current }) {
    const isActive = index === current

    return (
        <div className={`w-[80%] items-center mt-3 transition-all flex h-10 mx-auto rounded-lg text-white ${isActive ? "bg-white text-black" : ''} cursor-pointer`} onClick={() => {
            set(index)
        }}>
            <div className="px-3">
                {icon}
            </div>
            <p className={`${isActive ? "text-black" : "text-white"} text-xl font-semibold`}>{text}</p>
        </div>
    )
}
