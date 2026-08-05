import React from 'react';

const DumbbellChart = ({ title, rows, isDarkMode, colorGainsLosses, showValues }) => {
  // Determine min and max values to calculate scale
  let minVal = Infinity;
  let maxVal = -Infinity;
  
  rows.forEach(row => {
    if (row.from < minVal) minVal = row.from;
    if (row.to < minVal) minVal = row.to;
    if (row.from > maxVal) maxVal = row.from;
    if (row.to > maxVal) maxVal = row.to;
  });

  // If no valid data
  if (minVal === Infinity || maxVal === -Infinity) {
    minVal = 0;
    maxVal = 100;
  }
  
  // Add padding to domain (10% on each side)
  const range = maxVal - minVal || 1;
  const padding = range * 0.15;
  const xMin = minVal - padding;
  const xMax = maxVal + padding;
  const totalRange = xMax - xMin;

  // Chart dimensions
  const width = 800;
  const rowHeight = 100;
  const marginTop = 80;
  const marginBottom = 40;
  const labelWidth = 150;
  const chartAreaWidth = width - labelWidth - 40; // 40px right padding
  
  const height = marginTop + (rows.length * rowHeight) + marginBottom;

  const mapX = (val) => {
    return labelWidth + ((val - xMin) / totalRange) * chartAreaWidth;
  };

  const textColor = isDarkMode ? '#f3f4f6' : '#111827';
  const lineColor = isDarkMode ? '#374151' : '#e5e7eb';
  const labelBgColor = '#2563eb'; // blue-600
  
  const getDumbbellColor = (from, to) => {
    if (!colorGainsLosses) return isDarkMode ? '#60a5fa' : '#3b82f6'; // primary color
    if (from < to) return '#10b981'; // Green for increase
    if (from > to) return '#ef4444'; // Red for decrease
    return '#6b7280'; // Gray for neutral
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`} 
      width="100%" 
      height="100%"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Title */}
      <text x="20" y="40" fontSize="24" fontWeight="500" fill={textColor}>
        {title}
      </text>

      {rows.map((row, index) => {
        const yCenter = marginTop + (index * rowHeight) + (rowHeight / 2);
        const xFrom = mapX(row.from);
        const xTo = mapX(row.to);
        const color = getDumbbellColor(row.from, row.to);
        const isSame = row.from === row.to;
        
        return (
          <g key={row.id || index}>
            {/* Background horizontal line */}
            <line 
              x1={labelWidth} 
              y1={yCenter} 
              x2={width - 20} 
              y2={yCenter} 
              stroke={lineColor} 
              strokeWidth="2" 
            />

            {/* Row Label Pill */}
            <rect 
              x="20" 
              y={yCenter - 16} 
              width={90} 
              height="32" 
              rx="6" 
              fill={labelBgColor}
            />
            <text 
              x="65" 
              y={yCenter + 5} 
              fontSize="14" 
              fill="#ffffff" 
              textAnchor="middle"
              fontWeight="500"
            >
              {row.label}
            </text>

            {/* Dumbbell Connection Line */}
            {!isSame && (
              <line 
                x1={xFrom} 
                y1={yCenter} 
                x2={xTo} 
                y2={yCenter} 
                stroke={color} 
                strokeWidth="6" 
              />
            )}

            {/* From Point */}
            <circle 
              cx={xFrom} 
              cy={yCenter} 
              r="8" 
              fill={(!row.fromSymbol || row.fromSymbol === 'hollow') ? (isDarkMode ? '#111827' : '#ffffff') : color} 
              stroke={color} 
              strokeWidth="4" 
            />

            {/* To Point */}
            {!isSame && (
              <circle 
                cx={xTo} 
                cy={yCenter} 
                r="8" 
                fill={(row.toSymbol === 'hollow') ? (isDarkMode ? '#111827' : '#ffffff') : color} 
                stroke={color} 
                strokeWidth="4" 
              />
            )}

            {/* Values on top */}
            {showValues && (
              <>
                <text 
                  x={xFrom} 
                  y={yCenter - 20} 
                  fontSize="16" 
                  fill={color} 
                  textAnchor="middle"
                  fontWeight="500"
                >
                  {row.from}
                </text>
                {!isSame && (
                  <text 
                    x={xTo} 
                    y={yCenter - 20} 
                    fontSize="16" 
                    fill={color} 
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {row.to}
                  </text>
                )}
              </>
            )}

            {/* Sub Labels on bottom */}
            {showValues && (
              <>
                <text 
                  x={xFrom} 
                  y={yCenter + 26} 
                  fontSize="14" 
                  fill={color} 
                  textAnchor="middle"
                >
                  {row.fromLabel}
                </text>
                {!isSame && (
                  <text 
                    x={xTo} 
                    y={yCenter + 26} 
                    fontSize="14" 
                    fill={color} 
                    textAnchor="middle"
                  >
                    {row.toLabel}
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default DumbbellChart;
