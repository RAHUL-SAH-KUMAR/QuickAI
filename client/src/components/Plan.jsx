import React from 'react';
import { PricingTable } from '@clerk/clerk-react';

const Plan = () => {
  return (
    <div className="max-w-2xl mx-auto z-20 my-24 px-4 sm:px-0">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-slate-700 text-4xl sm:text-5xl font-semibold">
          Choose Your Plan
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto mt-4">
          Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>

      {/* Pricing Table */}
      <div className="mt-14 sm:mx-0 mx-2">
        <PricingTable />
      </div>
    </div>
  );
};

export default Plan;
