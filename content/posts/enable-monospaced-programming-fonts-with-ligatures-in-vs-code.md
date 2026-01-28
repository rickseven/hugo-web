+++
date = 2021-04-08T17:00:00Z
title = "Enable Monospaced Programming Fonts with Ligatures in VS Code"
[author]
name = "Moh Eric"

+++
![Not Ligature vs Ligature Fonts](/uploads/not-ligature-vs-ligature-fonts.png "Not Ligature vs Ligature Fonts")

Typographic ligatures are when multiple characters combine into a single unique character. In simple terms, when you type two or more characters, they magically merge together. Some fonts are designed with ligatures specifically for software development, making your code look cleaner and more readable.

Here are some popular free fonts that support ligatures: [JetBrains Mono](https://www.jetbrains.com/lp/mono/ "JetBrains Mono"), [Cascadia Code](https://github.com/microsoft/cascadia-code "Cascadia Code"), [Fira Code](https://github.com/tonsky/FiraCode "Fira Code"), [Iosevka](https://github.com/be5invis/Iosevka "Iosevka"), [Hasklig](https://github.com/i-tu/Hasklig "Hasklig"), [Monoid](https://larsenwork.com/monoid/ "Monoid"), and [Victor Mono](https://rubjo.github.io/victor-mono/ "Victor Mono").

This tutorial will show you how to set up font ligatures in Visual Studio Code. I'm assuming you've already downloaded and installed a ligature font on your machine. Let's get started!

First, you'll need to change your editor font. Open VS Code settings by going to **File → Preferences → Settings**, then navigate to **Text Editor → Font**. Change the font family to the ligature font you want to use. For example, I'm using `JetBrains Mono`.

Next, you'll need to explicitly enable ligatures. This requires editing the `settings.json` file directly. Add the `"editor.fontLigatures"` setting to enable them. Your settings should look something like this:

    {
      "editor.fontFamily": "JetBrains Mono",
      "editor.fontLigatures": true,
      "...": "your other settings",
    }

That's it! Once you've made these changes, you're ready to enjoy beautiful ligatures in your code.
