import { useCallback, forwardRef, useEffect, useRef, memo } from "react";
import { Collapse } from "bootstrap/dist/js/bootstrap.bundle.min";

import { useBsEvents } from "../hooks/useBsEvents";

export const BsAccordion = memo(
  ({
    items = [
      {
        content: <p>This is the first item.</p>,
        header: "First",
        toggle: true,
        id: "first",
      },
      {
        content: <p>This is the second item.</p>,
        header: "Second",
        toggle: false,
        id: "second",
      },
      {
        content: <p>This is the third item.</p>,
        header: "Third",
        toggle: false,
        id: "third",
      },
    ],
  }) => {
    const accordionRef = useRef();

    return (
      <Accordion ref={accordionRef}>
        {items.map(({ content, header, toggle, id }) => (
          <AccordionItem
            ref={accordionRef}
            content={content}
            toggle={toggle}
            header={header}
            key={id}
          />
        ))}
      </Accordion>
    );
  }
);

const Accordion = forwardRef(({ children }, ref) => {
  return (
    <div className="accordion" ref={ref}>
      {children}
    </div>
  );
});

const AccordionItem = memo(
  forwardRef(({ content = <strong>
        This is the accordion body.
      </strong>, header = "Accordion item", toggle }, parentRef) => {
    const { collapsed, toggler, ref } = useBsCollapse({ parentRef, toggle });

    return (
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className={`accordion-button ${collapsed}`.trimEnd()}
            onClick={toggler}
            type="button"
          >
            {header}
          </button>
        </h2>
        <div className="accordion-collapse collapse" ref={ref}>
          <div className="accordion-body">{content}</div>
        </div>
      </div>
    );
  })
);

const useBsCollapse = ({ parentRef, toggle }) => {
  const ref = useRef();

  useEffect(() => {
    const parent = parentRef.current;

    const bsCollapse = new Collapse(ref.current, { parent, toggle });

    return () => {
      bsCollapse.dispose();
    };
  }, [parentRef, toggle]);

  const toggler = useCallback(
    () => Collapse.getInstance(ref.current).toggle(),
    []
  );

  const state = useBsEvents({ bsComponent: `collapse`, ref });

  const collapsed = ["shown", "show"].includes(state)
    ? ""
    : ["hidden", "hide"].includes(state)
    ? "collapsed"
    : "collapsed";

  return { collapsed, toggler, ref };
};

Accordion.displayName = "Accordion";

BsAccordion.displayName = "BsAccordion";

AccordionItem.displayName = "AccordionItem";
