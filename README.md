#Show Constructor

An application for helping me generate narratives for an upcoming animated show project "Previously on Previously on". The project will consist only of "previously on" montages, leaving the viewer to piece together the story without having access to the whole narrative (especially the last episode, not even a part of which will ever be shown).

Check it out [HERE](https://shmunj.github.io/Show-Constructor/).

This is based on my Python module that did the same thing, but translated into JavaScript, where I dropped all classes and placed everything in DOM elements instead. I played with the Python module in ipython interactive shell, but this will provide a more intuitive visual interface for other people working on the same project.

In this application, a *Show* you are constructing consists of individual *Episodes*, which, in turn, consist of individual *Scenes*. Every *Scene* is defined by its *importance* for the story, importance *decay* rate and *description* of what happens in the Scene. After every Episode, importance of every Scene prior to it drops by the value of decay rate, and a *"previously on"* section is generated by picking random Scenes based on their importance. You are then free to create the Scenes of the latest Episode, using "previously on" section as a guide. Ask yourself why are those specific scenes shown in the "previously on" montage to the viewer (and even why in that order) and try to give an answer in the form of the content of the latest Episode. The more sensible and linear your narrative is, the easier challenges will be presented to you by the constructor, although you are certainly free to try to create something more challenging like a narrative inspired by Back to the Future, Primer or Rashomon. In any case, you dictate the story dynamics and complexity. Equal importance and no decay in all scenes means completely random "previously on" section, low importance, but low or no decay means the scene might surprise you when it pops out later in the series, very high importance but high decay means the scene will be very important for very short time (like scenes in which main characters are introduced).

To do list:
- input validation
- tags for marking characters, locations or whatever else the user tags
- a panel for searching, jumping to and modifying tagged text
- exporting and importing the whole show structure in JSON format
