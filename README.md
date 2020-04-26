# GNOME-Emailer
Gnome GTK app for sending template based emails

## Getting the program
git clone git@github.com:brainstormtrooper/GNOME-Emailer.git
-or-
download the ZIP archive

## Running the program
cd GNOME-Emailer
gjs ./main.js


### Creating a CSV mailing list
Create a CSV file with the first column being valid email addresses.
The first row is the header. The first header cell must be address and indicates the email address of the recipient. The rest will be variable names to use in your templates.

Each subsequent row should contain a valid email address followed by values for the defined variables.

_Sample_

```
address,name,likes
recipient1@email.com,Bob,red cars
recipient2@otheremail.com,Tom,fast cars
recipient3@email.com,Sam,luxury cars
```

### Creating a mailing
In the Settings tab, fill in the account information, hit the Save button on the settings form

In the Recipients tab, import your CSV file

In the Contents tab, open or create your template, hit the Save button on the editing form
* Use {{variable}} to include one of your named variables in your template

In the Results tab, hit the Send button. The rusults of the mailing will be displayed.

### Opening and saving your mailings
You can save your mailing to a file for reuse or to send later by hitting the Save button on the header bar and selecting a file to save to.

You can open a saved file by hitting the file chooser button on the header bar.