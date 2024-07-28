# Assignment 1
Build the front-end for a web application to browse the NZBirds dataset.

``Due: 8th August, week 4``
``Marks: 15% of your final grade``
## NZBirds dataset
The data set contains 68 species of NZ birds and has been compiled by University of Otago in collaboration with The National Museum of NZ (Te Papa), the Department of Conservation (DOC) and the Ornithological Society of NZ (Birds NZ). There are also 68 images that have been made available by individual bird photographers of New Zealand.

This data was kindly provided to us under good faith under the condition it is only used for research and educational purposes here at the University of Otago.

The NZBirds datasets is made up of 68 JPEG images (one for each bird) and a single JSON file that contains information about each bird including the filename for the image for each bird.

The JSON file and the images files for the datasets are available in two places:

On Blackboard under the Assignments section. Look for data.zip.

In the Owheo lab evironment at K:\COSC203\assignment1_data

### NZBirds JSON file
The data set should be self-explanatory. The file nzbird.json contains text information in JSON format

### JSON properties
primary_name the bird’s Māori name
english_name the bird’s english name
status the conservation status (see appendix A)
photo.credit the name of the photographer
photo.source the url of the image file
more JSON properties in the full download…
Here is a snippet from nzbird.json
```
{
   "primary_name": "K\u0101k\u0101",
   "english_name": "Kaka",
   "status": "Recovering",
   "photo": {
      "credit": "Judi Lapsley Miller",
      "source": "data/images/kaka-30.jpg"
   }
}
```

### The Web App
The final result should look something like the example solution that is linked below. We encourage you to be creative with the design of your web application There will be bonus marks for anything beyond the stated requirements or outside of the box.

[Example Solution](https://cosc203.cspages.otago.ac.nz/assignments/img/a1-example-2.png)

### Deliverables
Your project should be stored in the School of Computing’s GitLab server, altitude.otago.ac.nz. Your site should be hosted using cspages on GitLab. Ensure your repository is private and add Mark George (geoma48p) as a Reporter (not Guest).

We will validate academic integrity with plagiarism detection software. So, make sure your Git repo is set to private. If there are any false positives, we will manually inspect git logs to determine provenance. Your Git repository should show a history of you working on the project throughout the semester — having only one or two large commits is not acceptable, and will result in mark deductions.

### The Report
Include a brief report (PDF, plain text, or Markdown) that includes:
```
Your student ID
A link to your git repository
A link to your site
A brief description of any unresolved issues
A brief description of any enhancements or extra features for bonus marks!
Submitting Your Assignment
Submission instructions will be posted on Blackboard closer to the deadline.
```

### Marking Rubric
The appendicies below contain specific information about the project requirements. The marking rubric below is a rough guide to how your assignment will be marked.

```
Feature	Marks
Content: all photos by default	2
Content: each bird’s name in both Māori and English	2
Content: each bird’s conservation status in both text and colour	2
Content: credit for each photo	1
Form: search filtering	3
Form: category filtering	3
Form: Handle special characters (diacritics)	1
Correctness: pass the W3C Validator	1
Correctness: correct use of form and semantic elements	1
Style: Looks nice	2
Bonus: Extra features*	2
Total	20
*You must identify any extra feature(s) in your report.
```
## Appendix A. Functional Requirements (the what)
### Site Content
- Display all 68 birds and their photos
- Display the bird’s name in both Māori and English
- Display the bird’s conservation status in both text and colour
The colour could be a circular emblem, an accent, literally anything!

See the status property in nzbird.json and Appendix C below for more info
**Credit the photographer for each image displayed**
See the photo.credit property in nzbird.json
Credit https://www.birdsnz.org.nz/ in the page <footer>
### Search Feature
- A form to filter the birds
- A search box to filter by a query string
query string should be matched against all the birds different names Māori, English, scientific, etc…
- A dropdown menu to filter by category
Where the category is conservation status (see Appendix A below)
### Bonus Marks
Include something extra, something useful, something shiny.
The JSON file includes extra data, maybe use that somehow?

## Appendix B. Nonfunctional Requirements (the how)
### HTML
This assignment is a Single-page application (SPA) so you only need 1 HTML file (named index.html)
You may include multiple pages if necessary.

Correctly use Semantic Elements:
`<header>, <footer>, <main>, <aside>, <section>`, etc…
You probably won’t need `<nav>` as a SPA does not have page navigation.

Correctly use Form Elements:
`<form>, <input>, <label>, <button>, <select>, <option>`


**Your HTML must pass the W3C Validator with 0 errors and 0 warnings**

### CSS
Your design should look nice, you have plenty of creative freedom with the site.
You should use pure CSS to style the web app (Bootstrap, or any other styling/layout framework should not be used)
You should `<link>` the stylesheet from a separate .css file(s).

Avoid inline styles.
### JavaScript
Since we are developing for modern web browsers, your JavaScript code may target any modern ECMAScript standard (ES6 or above).

You may use first-class function declarations:

*function* funcName(param) { **return** param };

You may use arrow function expressions (lambda syntax):

**const** funcName **=** (param) => { **return** param };

### Fetching Data
The nzbird.json file should be retrieved asynchronously with JavaScript’s Fetch function.
You should always handle any potential errors when fetching data.
You could use fetch with promises

```
function fetchData() {
	fetch('https://website.com/file.json') // fetch data from API
		.then(response => response.json()) // parse to JSON
		.then(data => console.log(data)) // use the data
		.catch(error => console.error(error)) // error handling
	});
}
```

Or you could use fetch with async/await

```
async function fetchData() {
	const response = await fetch('https://website.com/file.json');
	if (!response.ok){
		console.error(response.status}); // error handling
	}
	const data = response.json()  // parse to JSON
	console.log(data); // use the data
}
```

### DOM Manipulation
After you have fetched the data, your site should use JavaScript’s DOM manipulation functions to create the elements for each bird’s data/photo. You may find the following functions useful:

- document.querySelector()
- document.createElement()
- document.appendChild()

### String Searching
For the search feature, you will need to compare strings. Many words in the NZBird dataset contain diacritics (the accents found in many Māori words).
The search string "Kaka" should match with the string "Kākā"

We recommend using the normalize() function with Unicode Normalization Form C
myString.normalize("NFC"). Converting all strings to lower-case may also improve search results

You may find JavaScript’s array functions useful (possibly)
- myArray.filter()
- myArray.sort()
- myArray.find()
- myArray.forEach()

## Appendix C. Conservation Status
The conservation status of each bird comes directly from the Department of Conservation (DOC). Each status level indicates how endangered the species is. Each status level also has an associated colour, which is provided below:

```
Status Key	            Hex Code
Not Threatened	        #02a028	
Naturally Uncommon	    #649a31	
Relict	                #99cb68	
Recovering	            #fecc33	
Declining	            #fe9a01	
Nationally Increasing	#c26967	
Nationally Vulnerable	#9b0000	
Nationally Endangered	#660032	
Nationally Critical	    #320033	
Extinct	                black	
Data Deficient	        black	
```