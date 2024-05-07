const classificationDefs = Object.fromEntries(
  [
    "High School",
    "Auditor",
    "Undergraduate Nondegree",
    "Freshman",
    "FR",
    "Sophomore",
    "SO",
    "Junior",
    "JR",
    "Senior",
    "SR",
    "Post Baccalaureate Degree-Seeking",
    "Post Baccalaureate Certificate",
    "Graduate Nondegree",
    "GR",
    "Graduate Certificate",
    "Masters",
    "Post Masters Certificate",
    "Specialists",
    "Doctors Degree Other (Coursework)",
    "Doctors Degree Professional Practice",
  ].map((value, position) => [value, { position }])
);

const collegeDefs = {
  "College of Just, Sfty, Mil Sci": {
    formatted: "Justice, Safety, & Military Science",
    position: 6,
  },
  "College of Edu & App Human Sci": {
    formatted: "Education & Applied Human Sciences",
    position: 4,
  },
  "College of Arts & Sciences": {
    formatted: "Arts & Sciences (prior to 2016)",
    position: 3,
  },
  "College of Health Sciences": { formatted: "Health Sciences", position: 5 },
  "College of Ltrs, Arts, SocSci": { formatted: "CLASS", position: 2 },
  "Academic Affairs": { formatted: "Academic Affairs", position: 0 },
  "Graduate School": { formatted: "Graduate School", position: 8 },
  "College of Business": { formatted: "Business", position: 1 },
  "College of STEM": { formatted: "STEM", position: 7 },
};

const studentTypeDefs = {
  "New First Time Grad Applicant": { position: 3 },
  "Graduate Student-Clear Admit": { position: 6 },
  "Grad Probationary Admission": { position: 4 },
  "Grad Provisional Admission": { position: 5 },
  "New First Time Freshman": { position: 0 },
  "New First Time Transfer": { position: 1 },
  "High School Special": { position: 7 },
  "EKU Dual Credit": { position: 8 },
  "Non Degree": { position: 9 },
  Continuing: { position: 2 },
  Returning: { position: 10 },
  Visiting: { position: 11 },
};

const getDefFormatter =
  (lookup) =>
  ({ value = "" }) =>
    value in lookup ? lookup[value].formatted : value;

const getDefComparator = (lookup) => (a, b) =>
  (a in lookup ? lookup[a].position : Object.keys(lookup).length) -
  (b in lookup ? lookup[b].position : Object.keys(lookup).length);

const collegeComparator = getDefComparator(collegeDefs);

const collegeValueFormatter = getDefFormatter(collegeDefs);

const studentTypeComparator = getDefComparator(studentTypeDefs);

const classificationComparator = getDefComparator(classificationDefs);

const fixHyphenatedCaps = (value) =>
  value
    .split(" ")
    .map((word) =>
      word
        .split("-")
        .map((part, i) => (i === 0 ? part : part.toLocaleLowerCase()))
        .join("-")
    )
    .join(" ");

export const fieldDefs = {
  courseOnline: {
    valueFormatter: ({ value = "" }) =>
      value === "ECampus Online" ? "EKU Online" : value,
  },
  serviceRegion: {
    valueFormatter: ({ value = "" }) =>
      fixHyphenatedCaps(value.split(":").join(": ")),
  },
  minority: {
    valueFormatter: ({ value = "" }) => value.replace("Minority", "URM"),
    headerName: "URM",
  },
  college: {
    valueFormatter: collegeValueFormatter,
    comparator: collegeComparator,
    sort: "asc",
  },
  online: {
    valueFormatter: ({ value = "" }) => fixHyphenatedCaps(value),
    headerName: "Modality",
  },
  classification: { comparator: classificationComparator, sort: "asc" },
  studentType: { comparator: studentTypeComparator, sort: "asc" },
  "4YrGraduate": { headerName: "4 Year Rate" },
  "5YrGraduate": { headerName: "5 Year Rate" },
  "6YrGraduate": { headerName: "6 Year Rate" },
  numNotRet: { headerName: "Did Not Return" },
  crseNumb: { headerName: "Course Number" },
  numGraduated: { headerName: "Graduated" },
  fteMoodys: { headerName: "FTE Moody's" },
  numRetained: { headerName: "Retained" },
  schedule: { headerName: "Course Type" },
  fteBasic: { headerName: "FTE Basic" },
  fteIpeds: { headerName: "FTE IPEDS" },
  subject2: { headerName: "Subject" },
  fteCpe: { headerName: "FTE CPE" },
  ftpt: { headerName: "FT/PT" },
  time: { headerName: "FT/PT" },
  grs: { headerName: "GRS" },
};
