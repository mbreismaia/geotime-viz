"use client";

const Config = () => {
    return (
        <div className="p-4 bg-gray-700 border-t border-gray-600">
            <div className="mb-4">
              <label htmlFor="param1" className="block text-sm">Parâmetro 1</label>
              <input type="text" id="param1" className="w-full p-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded" />
            </div>
            <div className="mb-4">
              <label htmlFor="param2" className="block text-sm">Parâmetro 2</label>
              <input type="text" id="param2" className="w-full p-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded" />
            </div>
            <div className="mb-4">
              <label htmlFor="param3" className="block text-sm">Parâmetro 3</label>
              <input type="text" id="param3" className="w-full p-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded" />
            </div>
          </div>
    );
};

export default Config;