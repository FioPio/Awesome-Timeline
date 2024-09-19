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
        this.registerMarkdownCodeBlockProcessor("awesometimeline", (source, el, ctx) => {
            const timelineData = parseTimelineData(source);
            renderTimeline(timelineData, el);
        });
    }

    onunload() {
        console.log("Unloading AwesomeTimeline plugin");
    }
}

function parseTimelineData(source: string): TimelineEvent[] {
    const lines = source.trim().split("\n");
    const events: TimelineEvent[] = [];
    let groupName = "";

    for (let line of lines) {
        if (line.startsWith("#")) {
            groupName = line.slice(1).trim();
        } else {
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

function renderTimeline(events: TimelineEvent[], container: HTMLElement) {
    const timelineContainer = document.createElement("div");
    timelineContainer.style.height = "400px";
    timelineContainer.id = "timeline-container";
    container.appendChild(timelineContainer); // Append to the provided container

    const items = new DataSet(
        events.map(event => ({
            id: event.name,
            content: event.name,
            start: event.start,
            end: event.end || undefined,
            group: event.group,
        }))
    );

    const options = {
        zoomable: true,
        zoomMin: 1000 * 60 * 60 * 24,
        zoomMax: 1000 * 60 * 60 * 24 * 365 * 100,
        horizontalScroll: true,
        verticalScroll: true,
        showCurrentTime: false,
    };

    const timeline = new Timeline(timelineContainer, items, options);

    // Simple label addition
    function updateLabels() {
        const labelsContainer = document.getElementById('label-container');
        if (labelsContainer) {
            labelsContainer.innerHTML = ''; // Clear existing labels
        }

        const eventElements = document.querySelectorAll('.vis-item');
        eventElements.forEach(eventElement => {
            const contentDiv = eventElement.querySelector('.vis-item-content');
            if (contentDiv) {
                const labelText = contentDiv.textContent || '';
                if (labelText) {
                    // Remove the 'vis-item-overflow' class from the parent
                    const overflowDiv = eventElement.querySelector('.vis-item-overflow');
                    if (overflowDiv) {
                        overflowDiv.classList.remove('vis-item-overflow');
                    }
                }
            }
        });


        const backgroundElements = document.querySelectorAll('.vis-background');

        backgroundElements.forEach((element: Element) => {
            // Cast element to HTMLElement
            const htmlElement = element as HTMLElement;
            htmlElement.style.backgroundColor = '#dfdfdf';
        });
    }

    // Update labels on change
    timeline.on('change', updateLabels);
    timeline.on('rangechanged', updateLabels);
    timeline.on('resize', updateLabels);

    // Initial call to position labels
    updateLabels();
}
