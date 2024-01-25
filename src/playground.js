// todo: checklist

// divide relevant & irrelevant in lists
// disable irrelevant options
// total next to All
// clicking All maybe only activates relevant?
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
