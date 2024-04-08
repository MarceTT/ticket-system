import React from "react";

const SkeletonTable = () => {
  return (
    <div className="animate-pulse">
      <div className="overflow-hidden shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between p-4 border-b bg-gray-200">
          <div className="bg-gray-300 h-6 w-1/6 rounded"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 h-6 w-24 rounded mr-2"></div>
            <div className="bg-gray-300 h-6 w-8 rounded"></div>
          </div>
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="bg-gray-300 h-4 w-32 rounded"></div>
              </th>
              <th className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="bg-gray-300 h-4 w-32 rounded"></div>
              </th>
              <th className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="bg-gray-300 h-4 w-24 rounded"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {[...Array(3)].map((_, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="bg-gray-300 h-4 w-40 rounded"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="bg-gray-300 h-4 w-56 rounded"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  <div className="h-4 bg-gray-300 rounded w-12"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-gray-100 text-right sm:px-6">
          <div className="inline-flex items-center space-x-2">
            <div className="bg-gray-300 h-6 w-20 rounded"></div>
            <div className="bg-gray-300 h-6 w-28 rounded"></div>
            <div className="bg-gray-300 h-6 w-16 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonTable;
