// todo: checklist

// disable irrelevant options
// total next to All (change this to total relevant)
// clicking All maybe only activates relevant? (means All button onChange handler needs relevance data--since onChange for other options don't require dependencies, maybe make All button handler a different callback)
// reset button
// weird behavior when turning All off on two different lists (maybe disable others when one is all items unchecked)
// possibly add search (based on difficulty) (change way sorted--float relevant & matching to top)

// clean up main method by extracting long, reusable calculations into separate functions
// make sure App is clear (especially section where dropdowns are being mapped--mapping over dropdowns may change when dropdown list data includes fields & values that are irrelevant to current row data--relevance currently only pertains to filtered row data)

// ? random notes

// sticky all buttons
// checked fractions

// dropdowns?
// column data where type === "string"
// how should dropdowns data structure be set up?
// what to consider?
// when changing state of value of field, should be quick to locate
// how about dropdowns[field][value] = ? (true or false) ✅
// how about maintaining history?
// do you need history? what if there is a simpler way?
// * when data gets filtered, relevant values for each field is subject to change
// * you can find filtered rows from updated dropdowns,
// * and then find relevant values from filtered rows
// what if you repeated a similar process for every field?
// imagine

// * think about this!
// const data = useData(url);
// const [prevData, setPrevData] = useState(data);
// const [someState, setSomeState] = useState(null);
// if (prevData !== data) {
//   setPrevData(data);
//   setSomeState(data > prevData ? "increasing" : "decreasing");
// }

// ? relevant dropdowns algorithm

/* 
what is the algorithm? (
setDataDropdowns(getAllRelevantDropdowns(data, dropdowns, history))
)
- get secondary relevant dropdowns (
getSecRelevantDropdowns(data, dropdowns, history, keys=Object.keys(dropdowns))
)
	- create copy of dropdowns where everything checked
	- modify dropdowns from history
		- each item in history contains field, action, option
		- if option is undefined, means "all"
		- based on item properties, assign actions to each field[option] in dropdowns
	- then get relevant data using standard process
	- then get relevant dropdowns (using relevant data & dropdowns & keys passed, mark which options for each field actually appear in the relevant data)
- then get stack (reverse history, for each history obj, only traverse each field once) (determines order in which each field was modified)
- for each field in stack, 
	- get primary relevant dropdowns by (data, dropdowns, history, field)
		- filtering field from history, then get secondary relevant dropdowns using data, dropdowns, filtered history, and sending field as the only item in keys
	- assign field's secondary relevant dropdown to this newfound primary relevant dropdown
- for each field in secondary relevant dropdowns, sort keys in dropdown
*/

// ? random

// what is "dropdowns"?
// each dropdown has a field
// each field has a relevance boolean to current data
// each field has values
// each value has a relevance boolean to current data
// each value has a relevance boolean to filtered data

// what components should be made to control rendering?

// what about "All" buttons having a different onChange handler?

// need to achieve structures below
// how?
// need to include field data relevance & value data relevance in state & state setting
// should you implement the logic for this now as well?
// your App jsx doesn't matter right now--work on implementing the dropdown data structures below and the dropdown state updating processes
// how does dropdown search change what you have described?
// should dropdown search just be another key in value object? (probably)

// ! dropdown data structures
/*
const dropdownState = {
  field1: {
    items: {
      value1: { dataRelevant: true, checked: true },
      valueN: { dataRelevant: true, checked: true },
    },
    dataRelevant: true,
  },
  fieldN: {
    items: {
      valueN: { dataRelevant: true, checked: true },
      value1: { dataRelevant: true, checked: true },
    },
    dataRelevant: true,
  },
};

const allDropdownInformationVisualized = {
  field1: {
    items: {
      value1: {
        filteredDataRelevant: true,
        dataRelevant: true,
        checked: true,
      },
      valueN: {
        filteredDataRelevant: true,
        dataRelevant: true,
        checked: true,
      },
    },
    dataRelevant: true,
  },
  fieldN: {
    items: {
      valueN: {
        filteredDataRelevant: true,
        dataRelevant: true,
        checked: true,
      },
      value1: {
        filteredDataRelevant: true,
        dataRelevant: true,
        checked: true,
      },
    },
    dataRelevant: true,
  },
};

const finalDropdownsToRender = {
  dataRelevant: [
    {
      items: {
        filteredDataIrrelevant: [
          { checked: true, value: "..." },
          { checked: true, value: "..." },
        ],
        filteredDataRelevant: [
          { checked: true, value: "..." },
          { checked: true, value: "..." },
        ],
        dataIrrelevant: [
          { checked: true, value: "..." },
          { checked: true, value: "..." },
        ],
      },
      field: "...",
    },
  ],
  dataIrrelevant: [
    {
      items: [
        { checked: true, value: "..." },
        { checked: true, value: "..." },
      ],
      field: "...",
    },
  ],
};
*/

// ! fun notes

// clean up jsx, transitions, & control rendering better (map it out) (deferred values as expensive calculation deps, state values as render values, start transition when setting state, memoize components for less render computation)

// other bs components to consider--
// modal
// offcanvas
// tabbable tab (navs & tabs)
// tabbable list item (list group)
// carousel
// popovers
// scrollspy
// toast
// tooltip
// collapse

// enable predefined gradients & shadows?
// https://getbootstrap.com/docs/5.3/customize/options/

// can you do anything with this color modes function?
// https://getbootstrap.com/docs/5.3/customize/color-modes/#javascript

// shows every bs component containing js
// https://getbootstrap.com/docs/5.3/getting-started/introduction/#js-components
// https://getbootstrap.com/docs/5.3/customize/optimize/#lean-javascript

// info about using bs js
// https://getbootstrap.com/docs/5.3/getting-started/javascript/

// info about modals & dropdowns on mobile
// https://getbootstrap.com/docs/5.3/getting-started/browsers-devices/#modals-and-dropdowns-on-mobile

// info on color contrast
// https://getbootstrap.com/docs/5.3/getting-started/accessibility/#color-contrast

// could create Components from all bs components found in sidebar
// https://getbootstrap.com/docs/5.3/components/accordion/

// could create Components from bs examples (snippets, navbars, custom components, ...)
// https://getbootstrap.com/docs/5.3/examples/

// icon component? (probably highly unnecessary)
// https://icons.getbootstrap.com/

// ! fonts that I like
/*
const fonts = [
  "anka-coder",
  "daddytimemono",
  "fantasque-sans",
  "iosevka",
  "profont",
  "sax",
  "serious-sans",
  "sk-modernist",
  "victor-mono",
  "monoid",
  "fairfax-hd-hax",
  "envy-code-r",
  "courier-prime-sans",
  "anonymous-pro",
  "apl385",
  "average",
  "b612-mono",
  "bedstead",
  "binchotan-sharp",
  "cm-unicode",
  "d2coding",
  "fairfax-hd",
  "hermit",
  "inconsolata",
  "inconsolata-otf",
  "inconsolata-g",
  "inconsolata-go",
  "latin-modern",
  "martian-mono",
  "monofur",
  "nanum-gothic-coding",
  "pt",
  "sono",
  "source-code-pro",
  "verily",
];
*/
