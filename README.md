![hero_icon_250](https://github.com/user-attachments/assets/5a7e74c1-1a7c-4448-879e-872e9549d2d5)


# Facteur (GNOME-Emailer)
Gnome GTK mail-merge application

## Usage Instructions
Usage instructions are in the wiki here:
https://github.com/brainstormtrooper/facteur/wiki

## Getting the program

### Flathub
https://flathub.org/apps/io.github.brainstormtrooper.facteur

### Binaries
OpenSuse binaries are available here:

https://software.opensuse.org/package/facteur

### Source

git clone git@github.com:brainstormtrooper/facteur.git

-or-

download the ZIP archive

## Running the program
cd GNOME-Emailer

gjs src/main.js


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

## Installing from source

This project uses the meson build system.

To install the application, run the following commands:

```meson <some build folder>```

```cd <some build folder>```

```ninja``` 

```meson install```

_Translations by http://hosted.weblate.org_
