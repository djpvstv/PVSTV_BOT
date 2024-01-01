# PVSTV_BOT
Desktop Web-Based Application for Parsing Slippi Replays for Super Smash Bros. Melee

## Demo
![demo for app](./doc/pvstvDemo1.gif)

## Parsing
Parsing allows you to open up a directory and get a snapshot of what exists in that directory.

You can view which connect codes exist in the directory, which characters were played, and also see which date range the replays exist in.

## Finding Combos
The "Find Combos" tab allows you to find strings of combos within replay files.
You can search for your replays by "Tag", "Character", "Character and Color", "Tag and Character", and "Tag, Character and Color". 

### Settings
The app allows you to specify the number of replays to process at a time, the number of frames allowed between when the opponent leaves a "downed" action state and enters the next one, and the number of frames to append and prepend to each individual combo.

### Filtering
The app allows a lot of options to narrow down what kind of combos you want to see. You can filter the full list of combos found and change the filter rules at any time, without searching through all the replays again.

You can filter by move ID, e.g. "dash attack", "Side Special", by action ID, e.g. "Raptor Boost Aerial", "Low Forward Tilt", by opponent the combo is performed on, by stage, and by how much damage the combo does or what % it starts at.

You can also filter by specific action strings. I can look for "Grounded Raptor Boost" into "Down Air" into "Forward Aerial".

You may also ensure that the combos must kill, or that the combo was clean (you didn't enter a disadvantaged state).