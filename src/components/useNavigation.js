import { useState, useEffect, useCallback } from 'react';

export default function useNavigation(initialFocusId = null) {
  const [focusedId, setFocusedId] = useState(initialFocusId);

  const forceFocus = useCallback((id) => {
    setFocusedId(id);
    const el = document.getElementById(id);
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, []);

  useEffect(() => {
    if (focusedId) {
      const el = document.getElementById(focusedId);
      if (el) {
        el.focus();
      }
    }
  }, [focusedId]);

  return { focusedId, setFocusedId, forceFocus };
}