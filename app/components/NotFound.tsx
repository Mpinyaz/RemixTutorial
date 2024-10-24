const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-orange-400 font-suse">
      <h1 className="font-bold text-5xl animate-in fade-in duration-1000 delay-1000 flex flex-wrap items-center  gap-2 mb-5">
        <img
          className="rounded-full w-20 h-20"
          src="../../public/remixtut/CROSS GRAIN LOGO abbr.jpg"
          alt="logo"
        />
        Cross Grain Studios
      </h1>
      <h1 className="leading-snug text-5xl animate-pulse">Page Not Found</h1>
      <p>The requested URL was not found on this server</p>
    </div>
  );
};

export default NotFound;
