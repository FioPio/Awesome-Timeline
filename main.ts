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

    // Calculate the minimum and maximum date from events
    const dates = events.flatMap(event => [event.start, event.end]).filter(date => date !== null) as string[];
    const minDate = new Date(Math.min(...dates.map(date => new Date(date).getTime())));
    const maxDate = new Date(Math.max(...dates.map(date => new Date(date).getTime())));

    // Add a margin of 20% around the date range
    const marginPercentage = 0.2;
    const range = maxDate.getTime() - minDate.getTime();
    const margin = range * marginPercentage;

    const adjustedMinDate = new Date(minDate.getTime() - margin);
    const adjustedMaxDate = new Date(maxDate.getTime() + margin);

    // Determine a reasonable minimum zoom level
    const minZoomLevel = 1000 * 60 * 60; // 1 h  //Math.max(1000 * 60 * 60 * 24, range / 365); // At least 1 day or one year of the range

    const options = {
        zoomable: true,
        zoomMin: minZoomLevel,
        zoomMax: adjustedMaxDate.getTime() - adjustedMinDate.getTime(), // Set max zoom based on the adjusted range
        horizontalScroll: true,
        verticalScroll: true,
        showCurrentTime: false,
        min: adjustedMinDate, // Set the minimum viewable date
        max: adjustedMaxDate // Set the maximum viewable date
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
