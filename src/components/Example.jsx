import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const classLookup = {
  top: "start-0 bottom-100",
  bottom: "start-0 top-100",
  start: "top-0 end-100",
  end: "top-0 start-100",
};

export const Example = () => {
  const ref = useRef(null);

  const [placement, setPlacement] = useState("top");

  const entry = useIntersectionObserver(ref);

  const { intersectionRatio } = entry;

  if (intersectionRatio === undefined) {
    console.log();
  } else {
    if (intersectionRatio !== 1 && placement === "top") setPlacement("bottom");
  }

  console.log(entry);

  const placementClasses = classLookup[placement];

  return (
    <div className="position-relative d-inline-block">
      <button className="btn btn-primary" type="button">
        Primary
      </button>
      <div className={`position-absolute z-3 ${placementClasses}`} ref={ref}>
        <button className="btn btn-primary" type="button">
          Secondary
        </button>
      </div>
    </div>
  );
};

function useIntersectionObserver(ref) {
  const [entry, setEntry] = useState(false);

  useEffect(() => {
    const div = ref.current;

    const observer = new IntersectionObserver((entries) =>
      setEntry(entries[0])
    );

    observer.observe(div);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return entry;
}
