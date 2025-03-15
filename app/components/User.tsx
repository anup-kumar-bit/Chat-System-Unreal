export default function Users(){
    return(
        <div className="w-36 h-full border-l-2 border-gray-500">
            {/* Left sidebar */}
            <div className=" border-r bg-white">
                {/* Chat list header */}
                <div className="p-4 bg-gray-50 border-b">
                    <h1 className="text-xl font-semibold">Chats</h1>
                </div>

                {/* Chat list */}
                <div className="overflow-y-auto h-full">
                    {[1, 2, 3, 4, 5].map((chat) => (
                        <div
                            key={chat}
                            className="flex items-center justify-center p-4 border-b hover:bg-gray-50 cursor-pointer"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-gray-300">
                                    <img src="https://icons.veryicon.com/png/o/movie--tv/movie-hero-icon/iron-man-6.png"></img>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}