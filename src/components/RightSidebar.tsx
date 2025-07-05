const RightSidebar = () => {
  return (
    <aside className="w-1/4 border-l border-gray-800 p-4">
      <input
        type="text"
        placeholder="Search IJIDeals"
        className="w-full p-2 rounded-full bg-gray-800 text-white placeholder-gray-500 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">What's happening</h2>
        <ul>
          <li className="mb-2 text-blue-400 hover:underline cursor-pointer">#PopularProduct</li>
          <li className="mb-2 text-blue-400 hover:underline cursor-pointer">#NewSeller</li>
          <li className="mb-2 text-blue-400 hover:underline cursor-pointer">#FlashSale</li>
        </ul>
      </div>
    </aside>
  );
};

export default RightSidebar;
