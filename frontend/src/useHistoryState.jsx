import { useState } from "react";
import { useLocation } from 'react-router-dom';

function useHistoryState(key, initialValue) {
  const location = useLocation();
  // console.log(location)
  const [rawState, rawSetState] = useState(() => {
    const value = location.state?.[key];
    return value ?? initialValue;
  });

  function setState(value) {
    location.replace({
      ...location,
      state: {
        ...location.state,
        [key]: value,
      },
    }, key);
    rawSetState(value);
  }

  console.log("history state: " + location?.state);

  return [rawState, setState];
}

export default useHistoryState;