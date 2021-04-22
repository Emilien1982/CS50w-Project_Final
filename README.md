# CS50 web - Final project: Restaurant Website that display informations to anyone and deals with the bookings.


## Desciption:
This website features depend on who's logged in or out.

### Anyone logged out can:
  * Access basic informations like regular opening hours, contacts and map.
  * Look for an availble table by 2 different manners:
    * By looking for the next available table, regarding only the number of guests.
    * By checking at specific date and time, if there still is a table available.

### An employee logged in as a Staff Member can:
  * Access the same features that anyone logged out
  * Search for an available table based on much more criteria than someone logged out, like:
    * Number of guests
    * If the table need to accessible for a disabled person
    * Which area(s) are acceptable ("main room", "exterior", ...)
    * Which table height(s) are acceptable ("low", "standard", "high")
    * Which time(s) are acceptable ("lunch" and/or "dinner)
    
    The suggestion are displayed on a calendar for the next 31 days and clicking a specific date-time opens
    a modal to choose a table and enter the client details.
    This modal integrate an "easy client" feature: after the user has typed the 6 first digit of the client's phone number
    any number from the database that match are suggested in a list. Clicking any of those suggestion will autocomplete 
    all the client's details.
    If no match, the user type all the details.
    If any important information (chosen table, client's number, client's name...) is missing the booking can't be done, an alert
    informs the user and the missing informations appear with a red border.
    
  * Access all the bookings details.
    The bookings are displayed on the a calendar and clicking a specific date - time opens a modal that show the details. 
    The modal also allow the delete to delete a booking (after confirmation).
    Any booking can be marked has "honored". Meaning the guests are arrived and the booking fade out by 50%. This way the 
    user ( the employee that  welcome the clients for instance ) see easily which table are steal waited or not.
    
  * Search for customer(s) thought some criteria that contain:
    * first name
    * last name
    * phone number and if it's a foreign number
    * is disabled
    * is not welcome (for customer that didn't honored a booking in the past or has been rude)
    
    This search gives a list with all the clients in the database that match the criteria. The more criteria, the less clients are returned (possiblt zero).
    Clicking on a client opens a modal that allows the user to edit any detail or delete the client.
    
    nb: Some criteria may look weird but they are based on my own experience, detailed on the "Why" section below.
    
 ### An Employee logged in as a Manager can:
  * Access the same features that anyone logged in as a Staff member
  * Access the settings about Tables
      A manager can delete, edit or create tables in order to represent his physical tables.
      A table is define by:
        * The area it is in
        * Its custom reference / name
        * Its capacity - how namy people can seat at it
        * Its height - because, for instance, it's important to ask a futur client if he is ok with a low table when taking the booking
        * If the table is accessible by a disabled person
        * If the table is active
        * If the table is a joker - joker tables are tables not supposed to be booked to avoid 100% tables booked. This way it's easier to find a solution 
          if they is something wrong with a booking (more guests that expected come, booking has been took on the wrong date, ...). Joker tables are usually 
          give to people without booking when almost all regular bookings are honored. They could also be used for "last minute" VIP, that why it's necessary
          to get joker tables represented it the booking program.
  * Access the settings about regular opening times and special opening dates
      A manager can define which lunch time and dinner time are opened for every day of the week.
      A manager can also define opening times for special date (or period). For instance, he may want to close the restaurant on Chrismas and open it only 
      for the lunch on public holidays.
      
      This page display the weekday openings + a button to update it. 
      It also diplay the list of created special dates + a button to create new ones. Each special dates has a button to delete it (after confirmation). 
      If a manager want to delete a date that already get bookings, the confirmation box alert him. If he delete it anyway, the bookings are display in 
      red on this page and on the booking list page, in order to think that clients need to be informed that their bookings are over.

### A SuperUser can:
  * Access the same features that anyone logged in as a Manager
  * Access the django admin, in order to create:
      * Create Staff or Manager account.
      * Update the rights of Staff or Manager


## Why did I choose that project:

Last year I used to work on a busy restaurant. This place is a beach restaurant, with high quality service and often fully booked 2 to 5 days ahead. 
I had a manager position. I had to manage the bar and floor team, cash in the clients, pick up phone calls, as well as a general supervision, all in 
the same time.
 
Bookings were done on paper book, I had to share it with the employee that prepare bookings before lunch or dinner. I often had to run (in the sand) to 
get it back or search the lose paper pen while a client called... And the worst was to answer the phone on very busy time, with 90% of people asking for 
a booking on the coming dinner (which was 100% booked 2 days ago). What a waste of time and energy.
 
This was very frustating, I didn't know any programing language at this time and I tried to do something with Excel... But the features needed are to complex
to be done this way.
 
So I decide to made the booking system of my dream. Based on my experience in the beach restaurant.
The big ideas were:
 * Giving everyone the possiblity to check possible booking by its own (meaning less call for fully booked service)
 * Web based system, in order to allow the owner, who not always at the restaurant but is asked by many people to have bookings, to check bookings and 
   to take bookings by it own (less call again, and a more "sophiticated" look)
 * Duplicable in order to have one Ipad next to the phone and one for the employee on the floor.
 * More convenient way to search a booking that in a paper book.
 * To keep track of "not welcome" clients. As people who books tables and never come are definitely not welcome, there is no better way to keep them in the
   database and alert the user if he type his phone number. 


## Why this project satisfies the distinctiveness and complexity requirements:

This project is distinctive because it is completly different than the programs done on lecture. Even "Flight", we are talking of bookings in both programs but 
the under the hood is completly different. Flight allow to book travel directly created by the user. In this project, the bookings (meanings a specific table, at a specific date and a specific time) are generated by the program, based on the informations (tables, openings times) created by the user.
So this project is more (more , more, more :) )complex thant any programm of the lecture. 
It has up to 7 models. 
It also dive in Django deeper: for instance I used template regrouping (to display results by month), I used many query filters, HttpResponse subclasses, modelForm (4) and so much stuff I never saw before. I had to spend a lot of time on the Django documentation.
It used a lot of Javascript to fetch data, display results or alert and highlight empty fields in form for instance.
I used Python further, for example I discover the compplexity of the Date objet.
This site is supposed to be fully responsive. I based the smallest screen on the iphone 5, which is 320px wide. Ipad is supposed to the principal device that connect to this website and this site is also ok with desktop screen.
This project has been a nice opportunity to go deeper in bootstrap as well. I mainly used modal, alert, buttons, table and flex features of bootstrap.

This project took me about 3 weeks full time to be done.


## Content of each files:

This site architecture is based on a layout that display the navbar, which is extended by a contextual page. 
The navbar's links are displayed according the user rights. 
The contextual page works with a dedicated Javascript file that deals with all the interactions this page can have with the user.
Those .HTML and .js files share the same name. 
Here are the presentation of those files couple, by there name:
 * login ( the only one without dedicated .js file): the page were Staff members or Managers can log in.
 * index: the first page, linked by the logo. This only one accessible by logged out people. This page display basic informations and allows to look 
   for next available table or to check if booking is still possible on a specific date and time.
 * date: is a setting page that allows manager to change weekdays opening times and to see, add and delete the special dates.
 * table: is a setting page that allows manager to see, add, edit and delete the tables.
 * staff: is a setting page that allows manager to see, add, edit and delete the staff members. Those informations are used in bookings to keep track of who made it
 * persons: is the page used by logged in users to search clients. They also can see, edit and delete clients details.
 * booking_search: is the page used by logged in users to find available tables (from today to the next 31 days) and make the booking.
   When a client is calling for instance.
 * booking_list: is the page used by logged in users to see bookings for the next 31 days, as well as the detailed booking for a specific date and time. He's aslo able to delete a booking or mark it "honored". For the employee that welcome the client for instance.
 
Others files .py:
 * views: contains all the views all and all the API functions. Api is mainly used to fetch data, like available tables, bookings of a specific date and time...
 * urls: constains all the route for the views and for the API.
 * models: contains all django models and modelForms (form automaticly generate from a model).


## Additional inforamtions:
1. Forms with date input use <input type='date'>. This type is surprisingly not supported by Safari. 
2. As I discovered a lot throught this project, my code is not always constant because I tried different technics.
3. I didn't evaluate the complexity of this project before I started it. On my next project I will spend more time to think of the feature I want and
   I will try to design the routes and the API in a more efficient way.
   
To be 'perfect' this code should be refactored. But I already spend so much time (about 3 weeks - full time) that I happy with this working version. 
I learn a lot with CS50w lecture and even more with this project. So I believe my next projects will tend more and more to a cleaner code. 
