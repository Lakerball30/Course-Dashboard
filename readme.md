Prupose: A dashboard that displays classes with people teacher and class.
Files: index.html App.js Style.css
Setup: Download repository, Open index.html run website.
How it works: Run the menu selector Display error message with Test selector Failure.
Known limitations: The course data is written inside app.js, so it can't be loaded from a file.
Search only checks the title, code, and instructor.
Invalid records are skipped, not fixed.
The selector failure is tested with a button.

DOm tree: ![alt text](image-1.png)
Explanation: showCourses finds the list on the page. If it can't, it shows an error message and stops.
checkCourse checks each record. Bad records are skipped and listed in the message area.
courseMatchesFilters keeps only the courses that match the status, level, and search text.
showSummary counts the courses and builds the summary cards.
makeCard builds a card for each course with createElement and textContent, and showCourses adds it to the page.

The hardest decision was what to do with invalid records. I chose to skip the bad ones and still show the good ones, instead of stopping everything with an error.

Evidence: In test 5, 4 bad records were skipped and the warning listed why. The other 7 courses still showed.