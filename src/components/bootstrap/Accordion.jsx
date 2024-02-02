import { forwardRef, useRef, memo } from "react";

import { combineClassNames } from "../../functions/combineClassNames";
import { useCollapse } from "../../hooks/bootstrap/useCollapse";

export const Accordion = memo(
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
    const ref = useRef();

    return (
      <div className="accordion" ref={ref}>
        {items.map(({ content, header, toggle, id }) => (
          <AccordionItem
            content={content}
            header={header}
            toggle={toggle}
            ref={ref}
            key={id}
          />
        ))}
      </div>
    );
  }
);

const AccordionItem = memo(
  forwardRef(({ content, header, toggle }, parentRef) => {
    const {
      ref: collapseRef,
      collapsed,
      toggler,
    } = useCollapse({ parentRef, toggle });

    return (
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className={combineClassNames(
              "accordion-button",
              collapsed ? "collapsed" : ""
            )}
            onClick={toggler}
            type="button"
          >
            {header}
          </button>
        </h2>
        <div className="accordion-collapse collapse" ref={collapseRef}>
          <AccordionBody>{content}</AccordionBody>
        </div>
      </div>
    );
  })
);

const AccordionBody = ({ className = "", ...rest }) => {
  return (
    <div
      {...rest}
      className={combineClassNames("accordion-body", className)}
    ></div>
  );
};

Accordion.displayName = "Accordion";
