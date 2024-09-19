import { Plugin } from "obsidian";
import { Timeline, DataSet } from "vis-timeline/standalone";


type TimelineEvent = {
    group: string;
    start: string;
    end: string | null;
    name: string;
};


export default class AwesomeTimelinePlugin extends Plugin {
    async onload() {
        // Register a new Markdown post processor for awesometimeline
        this.registerMarkdownCodeBlockProcessor("awesometimeline", (source, el, ctx) => {
            // Parse the timeline from the source
            const timelineData = parseTimelineData(source);
            renderTimeline(timelineData, el);
        });
    }

    onunload() {
        console.log("Unloading AwesomeTimeline plugin");
    }
}

// Function to parse the timeline data
function parseTimelineData(source: string): TimelineEvent[] {
    const lines = source.trim().split("\n");

    const events = [];
    let groupName = "";

    for (let line of lines) {
        if (line.startsWith("#")) {
            groupName = line.slice(1).trim();
        }
        else {
            const match = line.match(/(\d{4}-\d{2}-\d{2}T?\d{2}:\d{2}:\d{2})?~?(\d{4}-\d{2}-\d{2}T?\d{2}:\d{2}:\d{2})?\s(.+)/);
            if (match) {
                events.push({
                    group: groupName,
                    start: match[1],
                    end: match[2] || null,
                    name: match[3]
                });
            }
        }
    }
    return events;
}

// Function to render timeline
function renderTimeline(events: TimelineEvent[], container: HTMLElement) {

    // Use a timeline library to render the events, such as vis.js timeline
    const timelineContainer = document.createElement("div");
    timelineContainer.style.height = "400px";

    container.appendChild(timelineContainer);

    // Prepare timeline data
    const items = new DataSet(
        events.map((event, index) => ({
            id: index,
            content: event.name,
            start: event.start,
            end: event.end || undefined,
            group: event.group,
        }))
    );

    const options = {
        zoomable: true, // Enable zooming
        zoomMin: 1000 * 60 * 60 * 24, // Minimum zoom level 1 day
        zoomMax: 1000 * 60 * 60 * 24 * 365 * 100, // Max zoom 100 years
        horizontalScroll: true,
        verticalScroll: true,
    };

    const timeline = new Timeline(timelineContainer, items, options);
    // // 
}
