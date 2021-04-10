+++
date = 2021-04-08T17:00:00Z
draft = true
linktitle = "Enable Monospaced Programming Fonts with Ligatures in VS Code"
series = ["Hugo 101"]
title = "Enable Monospaced Programming Fonts with Ligatures in VS Code"
type = ["post", "posts"]
weight = "10"
[author]
name = "Moh Eric"

+++
![Not Ligature vs Ligature Fonts](/uploads/not-ligature-vs-ligature-fonts.png "Not Ligature vs Ligature Fonts")

Typographic ligatures are when multiple characters combine into a single unique character. Simplistically, when you type two or more characters and they magically attach to each other. Some fonts provide ligatures specifically for software development.

Some free fonts that support ligatures are: [JetBrains Mono](), [Cascadia Code](), [Fira Code](), [Losevka](), [Hasklig](), [Monoid](), [Victor Mono]().

This tutorial will show you how to setup font ligatures in Visual Studio Code. I assume that you have download and install ligature fonts on your local machine. Lets do it, you will need to edit the `settings.json` file. To do this open the VS Code settings (File -> Preferences -> Settings) select the Text Editor and Font settings. Change font name with the font you would like to use. For example I change the font with `JetBrains Mono`.

Once you’ve configured the font you’ll need to explicitly enable ligatures. This is a separate option and requires you to modify the `settings.json` file directly. You will need to add the `"editor.fontLigatures"` setting to your `settings.json` settings file. Once this is done your settings should include two lines that look something like this:

    {
      "editor.fontFamily": "JetBrains Mono",
      "editor.fontLigatures": true,
      "...": "your other settings",
    }

Once you’ve made these changes you should be ready to start taking advantage of ligatures in your code.