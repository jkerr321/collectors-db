
Base Collector's Database UI
==========
A UI for viewing and managing the (football programme) collection data contained in a google sheet

Table of Contents
-----------------

 - [Why](#why-does-this-exist)
 - [Requirements](#requirements)
 - [Usage](#usage)
 - [Development](#Development)
 - [Things still to do](#things-still-to-do)

Why does this exist
------------
Christmas present for my dad 2019!

Requirements
------------

To create a smiliar UI from your own data you will need:
 - a Google sheet containing your data. Mine has the following headings - 
    - ID
    - Season
    - League
    - League Tier
    - Date
    - Opponent
    - Home/Away	Score
    - Position
    - Points
    - Competition	
    - Match Notes
    - Got/Want
    - Programme Price
    - Programme Notes
 - A google project connected to your sheet (I used [this very helpful Twilio tutorial](https://www.youtube.com/watch?v=UGN6EUi4Yio) )
 - Your google project credentials saved as environment variables

Usage
-----
via the browser, e.g.: https://example-programme-database.herokuapp.com/

Development
-----

To run locally:

 - Clone the repo to your machine
 - Do $ `npm install`
 - Create a .env file with your google config variables
- Update `renderLandingPage.js` to point to your google sheet: `new GoogleSpreadsheet('[MY_SHEET_ID]')`
- run locally with `$ nodemon app.js`

Things to do
---------------------

- webkit styles
- tests
- password
- make colorTwo a transparent version of colourOne if no colourTwo supplied
- show filter string on main page
- ebay link
- DRY out get images function
- update readme once componentisation complete
- modal to push page down rather than up - use onclick window scrollTo - with propagate
- on table view, if match is clicked on, do edit inline?
- additional custom values, in front end, table, grid-match
- update code to use classes / renderLandingPage and main.js
- are non unique IDs on checkboxes a problem?
