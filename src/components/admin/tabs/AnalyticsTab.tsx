import React from 'react';
import { VisitorHeatmap } from '../VisitorHeatmap';
import { VisitorGeoMap } from '../VisitorGeoMap';

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <VisitorHeatmap />
      <VisitorGeoMap />
    </div>
  );
};
