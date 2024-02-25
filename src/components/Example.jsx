import { useEffect, useState, useRef } from "react";

const PopoverContainer = ({ className = "", ...rest }) => {
  return (
    <div
      className={`d-inline-block position-relative ${className}`.trim()}
      {...rest}
    ></div>
  );
};

const PopoverContentBox = ({
  borderVariant = "secondary-subtle",
  transitionDuration = 0.15,
  shadowVariant = "sm",
  bgVariant = "white",
  paddingSize = 2,
  roundedSize = 2,
  className = "",
  borderSize = 1,
  style = {},
  children,
  state,
  ...rest
}) => {
  const [placement, setPlacement] = useState("top");

  const positionLookup = {
    top: "start-0 bottom-100",
    bottom: "start-0 top-100",
    start: "top-0 end-100",
    end: "top-0 start-100",
  };

  const { borderWidth, transition, position, opacity, content, padding } = {
    opacity: state === "show" || state === "shown" ? 1 : 0,
    borderWidth: state !== "hidden" ? borderSize : 0,
    padding: state !== "hidden" ? paddingSize : 0,
    transition: `opacity ${transitionDuration}s`,
    content: state !== "hidden" && children,
    position: positionLookup[placement],
  };

  return (
    <div
      className={`shadow-${shadowVariant} p-${padding} rounded-${roundedSize} border border-${borderVariant} border-${borderWidth} bg-${bgVariant} position-absolute ${position} ${className}`.trim()}
      style={{ transition, opacity, ...style }}
      {...rest}
    >
      {content}
    </div>
  );
};

const Popover = ({ trigger, content }) => {
  const [state, setState] = useState("hidden");

  const { onTransitionEnd, onMouseEnter, onMouseLeave } = {
    onTransitionEnd: (e) => {
      if (e.target.style.opacity === "1") setState("shown");

      if (e.target.style.opacity === "0") setState("hidden");
    },
    onMouseEnter: () => setState("show"),
    onMouseLeave: () => setState("hide"),
  };

  return (
    <PopoverContainer onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>
      {trigger}
      <PopoverContentBox onTransitionEnd={onTransitionEnd} state={state}>
        {content}
      </PopoverContentBox>
    </PopoverContainer>
  );
};

export const Example = () => {
  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{ height: 1000 }}
    >
      <Button>Chance</Button>
      <Popover
        content={<Button variant="secondary">Chancellor</Button>}
        trigger={<Button>Chance</Button>}
      ></Popover>
    </div>
  );
};

const Button = ({ variant = "primary", className = "", ...rest }) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`.trim()}
      type="button"
      {...rest}
    ></button>
  );
};

function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
    if (isIntersecting) {
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";
    } else {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
    }
  }, [isIntersecting]);

  return (
    <div
      style={{
        border: "2px solid black",
        backgroundColor: "blue",
        height: 100,
        margin: 20,
        width: 100,
      }}
      ref={ref}
    />
  );
}

function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 1.0,
      }
    );
    observer.observe(div);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}
