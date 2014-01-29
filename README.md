HapYak iFrame Widgets
=======

This repository is intended to hold reference examples of iFrame annotation implementations that extend the standard functionality of the HapYak platform.

To use these examples you must copy them and paste them into an iFrame widget annotation on your video.

NOTE: Some examples require a specific HapYak license. Please carefully review the implementation to make sure it will work for you.



Examples:

*Loop-back widget*

This widget will replay a segment of the video until a certain variable is set. If a user attempts to scrub into the video beyond the segment, the widget will seek back to the beginning of the segment. It allows you to create custom "Gate" logic for branching, or information gathering.
  * The segment begins at the start time of the iFrame annotation and lasts for the annotation duration
  * Edit the code to define the condition that will end the looping behavior
  
  


*Video-in-Video*

This widget will play a supplemental video, embedded on top of a main video. The supplemental video will appear as a thumbnail which can be postioned anywhere on screen. When it is played it expands to be 75% of the main video and centers itself. When the supplemental video is played, the main video will pause and vice-vera.
  * Edit the code to include the HapYak "Native Embed Code" for the supplemental video you wish to play
  * Use the reference hapyak.viewer code to ensure you have the proper callbacks
