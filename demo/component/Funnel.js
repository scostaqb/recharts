import React, { Component } from 'react';
import { Funnel } from 'recharts';

const funnelData = [
  { name: 'Website visits', value: 15654 },
  { name: 'Downloads', value: 4064 },
  { name: 'Requested price list', value: 1987 },
  { name: 'Invoice sent', value: 976 },
  { name: 'Finalized', value: 846 },
];

function FunnelDemo() {
  return (
    <div className="funnel-chart-wrapper">
      <Funnel
        width={250}
        height={250}
        data={funnelData}
      />
    </div>
  );
}

export default FunnelDemo;
