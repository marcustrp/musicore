# musicore

Library for manipulating music scores, render sheet music, music theory exercises and more.

Importer for musicstring and ABC (using abcjs). Would like to support both MEI and MusicXML in the future.

_musicstring is a single-line music notation with some inspiration from ABC notation. Musicstring syntax specification can be found [here](https://github.com/marcustrp/musicstring)._

## Content

### Core

Core music concepts: clef, key, time signature, note, rest, scale...

### Score

The main part of musicore, the Score uses Core elements to create a music score representation. Includes
importers & exporters for different music formats, analyse tools...

### Layout

Takes a Score and creates a layout object, which can be used by an engraver for printing sheet music.

### Engraver

Print sheet music as an SVG, using data from Layout.

### Exercises

Music theory exercises (currently none available).

### Web component

The musicore library as a web component (currently partial and only for testing).

## References

A list of books and other references used when developing this library. Code comments can refer to this list of
references but using abbrevation of reference inside []. For example, [BB:153] means "Behind Bars, page 153".

- Behind Bars (Elaine Gould) [BB]

## Copyright

Copyright Marcus Gustafsson 2019-2024
