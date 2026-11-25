# Team Notes!

Hey guys, as I said in text, we dont need to do the bar chart, pie chart, and stacked bar chart. Those are just ideas from what Prof. Lane recommended, its mostly there for layout purposes, we can switch them out for anything yall want.

I pushed my quiz frontend to main if thats alright, also made a backup branch of it just in case. You should be able to pull everything and run locally just fine. I tried to add comments here and there so yall can understand my code easier.

What I implemented:
- An introduction screen explaining the experiment.
- The main experiment layout. This includes a sidebar for questions and answers and a large area for the D3 visualizations which is empty for now.
- A progress bar and trial counter.
- An answer input that accepts percentages between 0 and 100.
- A completion screen and a restart button.


## Whats missing
My quiz frontend isnt done,  I still need to connect them to the d3 visuals and record the answers and stuff. I also need to add an example/tutorial page but I can add that after we already have some of our visuals done/decided.

- We still need the three D3 visualizations made with random data for each trial. 
- For each visual we need to mark two values for users to compare
- We need to calculate the correct percentage value for each trial.
- We gotta connect the graphs to the quiz itself later on

- Participants answers need to be recorded, and we need to run the error calculation on each and add it to a CSV
- I really dont want to make a server or anything like that, so unless one of you wants to add one, we make users test on our personal computers and download the csv locally which we can later add to a master csv

- I have like 4-5 people I can think of that I can get as participants no issue, so i hope yall can find the rest.


### Im assuming yall know how to run locally but let me know if you have any issues