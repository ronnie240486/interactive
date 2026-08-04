import { useState, useEffect } from 'react';

export default function useGridColumns(containerId = 'grid-container', minCardWidth = 150, defaultCols = 6) {
  const [columns, setColumns] = useState(defaultCols);

  useEffect(() => {
    const updateColumns = () => {
      const el = document.getElementById(containerId);
      const width = el ? el.clientWidth : window.innerWidth;
      const calculated = Math.floor(width / minCardWidth);
      setColumns(Math.max(calculated, 3));
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [containerId, minCardWidth]);

  return columns;
}