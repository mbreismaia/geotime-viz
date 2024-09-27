"use client";

const Config = () => {
    return (
        <div className="p-4 bg-gray-700 border-t border-gray-600">
            <div className="mb-4">
              <label htmlFor="param1" className="block text-sm">Hour Interval</label>
              <input type="text" id="param1" className="w-full p-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded" />
            </div>
            <div className="mb-4">
              <label htmlFor="param2" className="block text-sm">Month Interval</label>
              <input type="text" id="param2" className="w-full p-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded" />
            </div>
            <div className="mb-4">
              <label htmlFor="param3" className="block text-sm">Multivariate Depth</label>
              <input type="text" id="param3" className="w-full p-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded" />
            </div>
            <div className="mb-4">
              <label htmlFor="param3" className="block text-sm">Coloring Method</label>
              <input type="text" id="param3" className="w-full p-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded" />
            </div>
            <div className="mb-4">
              <label htmlFor="param3" className="block text-sm">Dimensionality Reduction Algorithm</label>
              <input type="text" id="param3" className="w-full p-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded" />
            </div>
            <div className="mb-4">
              <label htmlFor="param3" className="block text-sm">Reference Point</label>
              <input type="text" id="param3" className="w-full p-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded" />
            </div>
            <div className="mb-4">
              <label htmlFor="param3" className="block text-sm">Filter by Day</label>
              <input type="text" id="param3" className="w-full p-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded" />
            </div>
            <button className="p-2 bg-blue-400 rounded">
              Run Ed
            </button>
          </div>
    );
};

export default Config;