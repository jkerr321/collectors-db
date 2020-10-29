
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
 - a Google sheet containing your data with, at a minimum, the following headings - 
    - ID
    - Season
    - Date
    - Opponent
    - Home/Away
    - Programme Got/Want
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
 - Create a `.env` file with your google config variables and sheet id
 - Update the `config.js` file with your configuration preferences, e.g. heading and colours for the site
- run locally with `$ nodemon app.js`

Things to do / enhancements
---------------------

- make colorTwo a more transparent version of colourOne if no colourTwo supplied
- show filter string on main page
- DRY out get images function
- allow inline editing on table view
