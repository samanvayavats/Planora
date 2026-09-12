import { GoogleGenAI } from "@google/genai";
import { PlotConfigurationTypePlotConfigurationTypeCombined } from "@/schema/v1/project/project.schema";
import { FloorAndRequirementsFloorVersionType } from "@/schema/v1/floor/floor.schema";
const ai = new GoogleGenAI();

const MODELS = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.6-flash"];

export async function generateFloorPlanData(
  projectConfig: PlotConfigurationTypePlotConfigurationTypeCombined,
  floorConfig: FloorAndRequirementsFloorVersionType,
) {
  const prompt = `
Generate a complete architectural floor plan and construction cost estimate.

PROJECT CONFIGURATION:
${JSON.stringify(projectConfig, null, 2)}

FLOOR CONFIGURATION:
${JSON.stringify(floorConfig, null, 2)}
`;

  let lastError: unknown = null;

  for (const model of MODELS) {
    try {
      console.log(`Generating floor plan using ${model}...`);

      const response = await ai.models.generateContent({
        model,
        contents: prompt,

        config: {
          responseMimeType: "application/json",
          temperature: 0.1,

          systemInstruction: `
You are an automated architectural floor-plan generation and
construction estimation engine.

Your task is to generate:

1. Floor plan information
2. Individual room information
3. Complete SVG floor plan
4. Construction cost estimate

RETURN ONLY VALID JSON.

Do not return:
- Markdown
- Code fences
- Explanations
- Comments
- Text outside JSON

The response MUST follow this structure:

{
  "floorPlan": {
    "plotWidth": number,
    "plotHeight": number,
    "totalArea": number,
    "utilization": number,
    "svgCode": string
  },

  "rooms": [
    {
      "roomId": string,
      "type": string,
      "area": number,
      "width": number,
      "height": number,
      "x": number,
      "y": number,
      "color": string,
      "doors": [
        {
          "id": string,
          "position": string,
          "x": number,
          "y": number
        }
      ],
      "windows": [
        {
          "id": string,
          "position": string,
          "count": number
        }
      ],
      "adjacent": [string],
      "priority": number
    }
  ],

  "costEstimate": {
    "materialCost": number,
    "laborCost": number,
    "contingency": number,

    "materialBreakdown": {
      "flooring": number,
      "painting": number,
      "plumbing": number,
      "electrical": number,
      "other": number
    },

    "timeline": {
      "duration": number,
      "phases": [
        {
          "name": string,
          "duration": number
        }
      ]
    },

    "assumptions": string,
    "location": string,
    "quality": string
  }
}


========================
FLOOR PLAN REQUIREMENTS
========================

Generate a realistic 2D architectural floor plan.

All rooms must:

- Fit completely inside the plot.
- Have valid width and height.
- Have valid x and y coordinates.
- Not overlap incorrectly.
- Have logical adjacency.
- Have appropriate doors.
- Have appropriate windows.

The room area should be:

area = width * height

The plot area should be:

totalArea = plotWidth * plotHeight

utilization represents the percentage of the plot occupied by rooms.

Use the same room dimensions and positions when generating the SVG.


========================
ROOM REQUIREMENTS
========================

Each room must contain:

roomId
type
area
width
height
x
y
color
doors
windows
adjacent
priority

Example roomId values:

"living_room"
"bedroom_1"
"bedroom_2"
"kitchen"
"bathroom_1"
"dining_room"
"balcony"
"garage"


========================
DOOR REQUIREMENTS
========================

Each door should contain:

id
position
x
y

position can be:

"north"
"south"
"east"
"west"
"entrance"


========================
WINDOW REQUIREMENTS
========================

Each window should contain:

id
position
count

position can be:

"north"
"south"
"east"
"west"


========================
ADJACENCY REQUIREMENTS
========================

adjacent contains the roomId values of rooms
that directly share a wall or have a logical direct connection.

Example:

"adjacent": [
  "kitchen",
  "dining_room"
]


========================
SVG REQUIREMENTS
========================

svgCode must contain a complete standalone SVG.

The SVG MUST:

- Start with <svg
- End with </svg>
- Use xmlns="http://www.w3.org/2000/svg"
- Have a valid viewBox
- Represent the generated floor plan
- Represent every generated room
- Show room boundaries
- Show room names
- Show doors
- Show windows
- Use valid SVG elements
- Be directly renderable in a browser

Allowed SVG elements include:

svg
g
rect
path
line
circle
polygon
polyline
text

Do not use:

- JavaScript
- HTML
- external resources
- external images
- scripts
- iframes
- XML declarations
- DOCTYPE

The SVG must be completely self-contained.


========================
COST REQUIREMENTS
========================

Generate a construction estimate based on:

- Plot size
- Built-up area
- Number and type of rooms
- Quality level
- Location

materialCost represents the estimated material cost.

laborCost represents the estimated labor cost.

contingency represents additional estimated cost.

materialBreakdown must contain:

flooring
painting
plumbing
electrical
other

The sum of materialBreakdown should approximately equal materialCost.

timeline.duration represents the total estimated construction duration.

phases must contain individual construction phases
and their durations.

Possible phases:

Foundation
Structure
Electrical
Plumbing
Flooring
Painting
Finishing


========================
IMPORTANT
========================

Do not calculate totalCost or costPerSqft.

The backend will calculate:

totalCost =
materialCost +
laborCost +
contingency

costPerSqft =
totalCost / totalArea

Return ONLY JSON.
`,
        },
      });

      const rawText = response.text?.trim();

      if (!rawText) {
        throw new Error(`${model} returned an empty response.`);
      }

      const data = JSON.parse(rawText);

      // Basic validation
      if (!data.floorPlan) {
        throw new Error("AI response missing floorPlan.");
      }

      if (!Array.isArray(data.rooms)) {
        throw new Error("AI response missing rooms array.");
      }

      if (!data.costEstimate) {
        throw new Error("AI response missing costEstimate.");
      }

      if (!data.floorPlan.svgCode) {
        throw new Error("AI response missing SVG code.");
      }

      // Validate SVG
      const svg = data.floorPlan.svgCode.trim();

      if (!svg.startsWith("<svg")) {
        throw new Error("Generated SVG does not start with <svg>.");
      }

      if (!svg.endsWith("</svg>")) {
        throw new Error("Generated SVG does not end with </svg>.");
      }

      if (!svg.includes('xmlns="http://www.w3.org/2000/svg"')) {
        throw new Error("Generated SVG has invalid xmlns.");
      }

      if (!svg.includes("viewBox")) {
        throw new Error("Generated SVG is missing viewBox.");
      }

      data.floorPlan.svgCode = svg;

      console.log(`Floor plan generated successfully using ${model}`);

      return data;
    } catch (error) {
      lastError = error;

      console.error(`Generation failed using ${model}:`, error);
    }
  }

  throw new Error(
    `All Gemini models failed during floor plan generation. Last error: ${String(lastError)}`,
  );
}
