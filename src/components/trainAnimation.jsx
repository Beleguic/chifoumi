const animateTrain = (type, sens) => {
    if (typeof type !== "string") {
      console.error("Type must be a string, received:", type);
      return null;
    }
  
    // Determine animation class based on "sens" parameter
    const animationClass = sens === "right-to-left" ? "move-right-to-left" : "move-left-to-right";
  
    return (
      <div className="relative w-full h-20 overflow-hidden mt-10">
        <div className={`absolute left-0 ${animationClass} z-4`}>
          {type === "RER" ? (
            <img src="/RER.png" alt="MI09 - RER" className="h-[45px]" />
          ) : type === "Metro" ? (
            <img src="/Metro.png" alt="MP89 - Metro" className="h-[45px]" />
          ) : (
            <img src="/Tram.png" alt="TW07 - Tram" className="h-[45px]" />
          )}
        </div>
      </div>
    );
  };
  
  export default animateTrain;
  