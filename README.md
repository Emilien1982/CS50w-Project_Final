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
    
