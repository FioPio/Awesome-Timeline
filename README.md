# AwesomeTimeline Plugin

The **AwesomeTimeline** plugin for Obsidian lets you create interactive timelines using simple markdown syntax. It integrates with the [vis-timeline](https://visjs.github.io/vis-timeline/docs/) library to render timelines directly within your Obsidian notes.

## Features

- **Interactive Timelines**: Visualize events in an interactive timeline format.
- **Customizable**: Adjust zoom levels, scroll options, and more.
- **Link Support**: Add internal Obsidian links within timeline events.


## Installation

1. **Download the Plugin Files**:
   - `main.js`
   - `manifest.json`
   - `styles.css` (if applicable)

2. **Place Files in Obsidian Directory**:
   - Copy the downloaded files to your Obsidian plugins directory: `.obsidian/plugins/awesome-timeline`.

3. **Enable the Plugin**:
   - Open Obsidian.
   - Navigate to `Settings` > `Community plugins` > `Installed plugins`.
   - Locate "Awesome Timeline" and toggle the switch to enable it.


## Usage

To create a timeline in your Obsidian notes, use the `awesometimeline` code block. Here’s the syntax for creating a timeline:

~~~markdown
```awesometimeline
# Group Name
StartDate~EndDate Event Name
```
~~~

### Example

~~~markdown
```awesometimeline
# Project Milestones
2024-09-01T09:00:00~2024-09-01T17:00:00 Project Kickoff
2024-09-15T00:00:00~2024-09-16T00:00:00 Initial Research [[Research Document|Research Document]]
2024-09-30T00:00:00~2024-09-30T23:59:59 Final Review [[Review Notes#Meeting]]
```
~~~


### Explanation

- **`# Group Name`**: Defines a group of related events.
- **`StartDate~EndDate Event Name`**: Specifies the start and end date of an event along with its name. If only a start date is provided, the end date defaults to null.
- **`[[Link]]`**: Supports internal Obsidian links. The link format `[[Link|Display Name]]` is also supported for custom display text.


## Troubleshooting

If the timeline does not render correctly:

- Ensure your markdown syntax is correct.
- Check the browser console for any error messages.
- Make sure the plugin is enabled and properly installed.

## Contributing

If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request on the GitHub repository.

## License

This plugin is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more details.

---

Happy timeline making with **AwesomeTimeline**!
