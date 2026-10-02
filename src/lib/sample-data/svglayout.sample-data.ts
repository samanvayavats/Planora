export interface SampleFloorPlan {
  id: string;
  title: string;
  floorNumber: number;
  plotWidth: number;
  plotHeight: number;
  totalArea: number;
  bedrooms: number;
  bathrooms: number;
  utilization: string;
  svgCode: string;
}

export const SAMPLE_LAYOUTS: SampleFloorPlan[] = [
  {
    id: "layout-1",
    title: "Executive 3BHK with Western Easement",
    floorNumber: 1,
    plotWidth: 50,
    plotHeight: 80,
    totalArea: 4000,
    bedrooms: 2,
    bathrooms: 2,
    utilization: "56.88%",
    svgCode: `"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 800\" width=\"100%\" height=\"100%\"><defs><pattern id=\"easementHatch\" width=\"10\" height=\"10\" patternTransform=\"rotate(45 0 0)\" patternUnits=\"userSpaceOnUse\"><line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"10\" stroke=\"#fca5a5\" stroke-width=\"1.5\" stroke-dasharray=\"2,2\"/></pattern></defs><rect width=\"500\" height=\"800\" fill=\"#f8fafc\" stroke=\"#64748b\" stroke-width=\"2\"/><rect x=\"0\" y=\"0\" width=\"80\" height=\"800\" fill=\"url(#easementHatch)\" opacity=\"0.4\"/><line x1=\"80\" y1=\"0\" x2=\"80\" y2=\"800\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"6,4\"/><text x=\"40\" y=\"400\" fill=\"#dc2626\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"bold\" transform=\"rotate(-90 40 400)\" text-anchor=\"middle\">8 FT MUNICIPAL WATER EASEMENT</text><g id=\"setbacks\" stroke=\"#cbd5e1\" stroke-width=\"1\" stroke-dasharray=\"4,4\"><rect x=\"80\" y=\"120\" width=\"360\" height=\"570\" fill=\"none\"/></g><rect id=\"garage\" x=\"80\" y=\"120\" width=\"180\" height=\"200\" fill=\"#f1f5f9\" stroke=\"#334155\" stroke-width=\"2.5\"/><rect id=\"porch\" x=\"260\" y=\"120\" width=\"80\" height=\"60\" fill=\"#e2e8f0\" stroke=\"#334155\" stroke-width=\"2\"/><rect id=\"foyer\" x=\"260\" y=\"180\" width=\"80\" height=\"80\" fill=\"#fef3c7\" stroke=\"#334155\" stroke-width=\"2\"/><rect id=\"study\" x=\"340\" y=\"120\" width=\"100\" height=\"140\" fill=\"#e0e7ff\" stroke=\"#334155\" stroke-width=\"2.5\"/><rect id=\"dining_room\" x=\"260\" y=\"260\" width=\"80\" height=\"140\" fill=\"#fef9c3\" stroke=\"#334155\" stroke-width=\"2\"/><rect id=\"kitchen\" x=\"340\" y=\"260\" width=\"100\" height=\"140\" fill=\"#ffedd5\" stroke=\"#334155\" stroke-width=\"2.5\"/><rect id=\"laundry\" x=\"80\" y=\"320\" width=\"100\" height=\"80\" fill=\"#e0f2fe\" stroke=\"#334155\" stroke-width=\"2\"/><rect id=\"powder_room\" x=\"180\" y=\"320\" width=\"80\" height=\"80\" fill=\"#fce7f3\" stroke=\"#334155\" stroke-width=\"2\"/><rect id=\"living_room\" x=\"80\" y=\"400\" width=\"180\" height=\"180\" fill=\"#fae8ff\" stroke=\"#334155\" stroke-width=\"2.5\"/><rect id=\"hallway\" x=\"260\" y=\"400\" width=\"80\" height=\"180\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\"/><rect id=\"bedroom_2\" x=\"340\" y=\"400\" width=\"100\" height=\"120\" fill=\"#dcfce7\" stroke=\"#334155\" stroke-width=\"2.5\"/><rect id=\"bathroom_2\" x=\"340\" y=\"520\" width=\"100\" height=\"60\" fill=\"#ccfbf1\" stroke=\"#334155\" stroke-width=\"2.5\"/><rect id=\"primary_bedroom\" x=\"80\" y=\"580\" width=\"180\" height=\"110\" fill=\"#ede9fe\" stroke=\"#334155\" stroke-width=\"2.5\"/><rect id=\"primary_bathroom\" x=\"260\" y=\"580\" width=\"90\" height=\"110\" fill=\"#cffafe\" stroke=\"#334155\" stroke-width=\"2\"/><rect id=\"walk_in_closet\" x=\"350\" y=\"580\" width=\"90\" height=\"110\" fill=\"#f3e8ff\" stroke=\"#334155\" stroke-width=\"2.5\"/><g id=\"windows\" stroke=\"#0284c7\" stroke-width=\"4\" stroke-linecap=\"round\"><line x1=\"360\" y1=\"120\" x2=\"420\" y2=\"120\"/><line x1=\"440\" y1=\"150\" x2=\"440\" y2=\"220\"/><line x1=\"440\" y1=\"290\" x2=\"440\" y2=\"360\"/><line x1=\"440\" y1=\"430\" x2=\"440\" y2=\"490\"/><line x1=\"440\" y1=\"540\" x2=\"440\" y2=\"560\"/><line x1=\"110\" y1=\"690\" x2=\"230\" y2=\"690\"/><line x1=\"280\" y1=\"690\" x2=\"320\" y2=\"690\"/><line x1=\"80\" y1=\"440\" x2=\"80\" y2=\"540\"/></g><g id=\"doors\" stroke=\"#b45309\" stroke-width=\"2\"><line x1=\"300\" y1=\"180\" x2=\"300\" y2=\"195\" stroke-width=\"2.5\"/><path d=\"M 300 195 A 15 15 0 0 0 285 180\" fill=\"none\" stroke=\"#d97706\" stroke-dasharray=\"2,2\"/><line x1=\"260\" y1=\"220\" x2=\"245\" y2=\"220\"/><line x1=\"340\" y1=\"190\" x2=\"340\" y2=\"205\"/><line x1=\"130\" y1=\"320\" x2=\"130\" y2=\"335\"/><line x1=\"220\" y1=\"320\" x2=\"220\" y2=\"335\"/><line x1=\"260\" y1=\"430\" x2=\"245\" y2=\"430\"/><line x1=\"340\" y1=\"430\" x2=\"340\" y2=\"445\"/><line x1=\"340\" y1=\"540\" x2=\"340\" y2=\"555\"/><line x1=\"170\" y1=\"580\" x2=\"170\" y2=\"595\"/><line x1=\"260\" y1=\"620\" x2=\"275\" y2=\"620\"/><line x1=\"350\" y1=\"620\" x2=\"365\" y2=\"620\"/></g><g id=\"roomLabels\" font-family=\"sans-serif\" font-size=\"10\" fill=\"#0f172a\" font-weight=\"600\" text-anchor=\"middle\"><text x=\"170\" y=\"215\" font-size=\"13\">2-CAR GARAGE</text><text x=\"170\" y=\"230\" font-size=\"9\" fill=\"#64748b\">18&apos; x 20&apos; (360 sqft)</text><text x=\"300\" y=\"155\">PORCH</text><text x=\"300\" y=\"225\">FOYER</text><text x=\"390\" y=\"185\" font-size=\"12\">STUDY / BED 4</text><text x=\"390\" y=\"200\" font-size=\"9\" fill=\"#64748b\">10&apos; x 14&apos; (140 sqft)</text><text x=\"130\" y=\"365\">LAUNDRY</text><text x=\"220\" y=\"365\">POWDER</text><text x=\"300\" y=\"335\">DINING</text><text x=\"390\" y=\"335\" font-size=\"12\">KITCHEN</text><text x=\"170\" y=\"490\" font-size=\"14\">LIVING ROOM</text><text x=\"170\" y=\"505\" font-size=\"9\" fill=\"#64748b\">18&apos; x 18&apos; (324 sqft)</text><text x=\"300\" y=\"495\">HALL</text><text x=\"390\" y=\"465\" font-size=\"12\">BEDROOM 2</text><text x=\"390\" y=\"480\" font-size=\"9\" fill=\"#64748b\">10&apos; x 12&apos; (120 sqft)</text><text x=\"390\" y=\"555\">BATH 2</text><text x=\"170\" y=\"635\" font-size=\"13\">PRIMARY SUITE</text><text x=\"170\" y=\"650\" font-size=\"9\" fill=\"#64748b\">18&apos; x 11&apos; (198 sqft)</text><text x=\"305\" y=\"640\">PRIMARY BATH</text><text x=\"395\" y=\"640\">W.I.C.</text></g><g id=\"compass\" transform=\"translate(440, 50)\"><circle cx=\"0\" cy=\"0\" r=\"16\" fill=\"#ffffff\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><polygon points=\"0,-14 4,-2 -4,-2\" fill=\"#ef4444\"/><polygon points=\"0,14 4,2 -4,2\" fill=\"#64748b\"/><text x=\"0\" y=\"-18\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">N</text></g><g id=\"dimensions\" font-family=\"sans-serif\" font-size=\"10\" fill=\"#475569\" text-anchor=\"middle\"><text x=\"250\" y=\"20\">FRONT ROAD (NORTH) - 50 FT</text><text x=\"490\" y=\"400\" transform=\"rotate(90 490 400)\">SIDE ROAD (EAST CORNER) - 80 FT</text></g></svg>"`,
  },
  {
    id: "layout-2",
    title: "Modern Compact 2BHK Urban Villa",
    floorNumber: 1,
    plotWidth: 40,
    plotHeight: 50,
    totalArea: 2000,
    bedrooms: 2,
    bathrooms: 2,
    utilization: "68.20%",
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%" style="background-color: #f9f9f9; font-family: 'Segoe UI', Helvetica, Arial, sans-serif;">
      <rect x="0" y="0" width="400" height="500" fill="#f0f4f1" stroke="#bdc3c7" stroke-width="3"/>
      <g id="rooms">
        <rect x="40" y="40" width="180" height="200" fill="#e3f2fd" stroke="#2c3e50" stroke-width="2"/>
        <text x="130" y="130" font-size="14" font-weight="bold" fill="#2c3e50" text-anchor="middle">Living Hall</text>
        <text x="130" y="150" font-size="11" fill="#7f8c8d" text-anchor="middle">360 sq ft</text>
        <rect x="220" y="40" width="140" height="200" fill="#fff3e0" stroke="#2c3e50" stroke-width="2"/>
        <text x="290" y="130" font-size="14" font-weight="bold" fill="#2c3e50" text-anchor="middle">Kitchen & Dine</text>
        <text x="290" y="150" font-size="11" fill="#7f8c8d" text-anchor="middle">280 sq ft</text>
        <rect x="40" y="240" width="180" height="150" fill="#e8f5e9" stroke="#2c3e50" stroke-width="2"/>
        <text x="130" y="310" font-size="14" font-weight="bold" fill="#2c3e50" text-anchor="middle">Master Bedroom</text>
        <text x="130" y="330" font-size="11" fill="#7f8c8d" text-anchor="middle">270 sq ft</text>
        <rect x="220" y="240" width="140" height="150" fill="#f3e5f5" stroke="#2c3e50" stroke-width="2"/>
        <text x="290" y="310" font-size="14" font-weight="bold" fill="#2c3e50" text-anchor="middle">Guest Bedroom</text>
        <text x="290" y="330" font-size="11" fill="#7f8c8d" text-anchor="middle">210 sq ft</text>
        <rect x="40" y="390" width="100" height="70" fill="#e0f7fa" stroke="#2c3e50" stroke-width="2"/>
        <text x="90" y="430" font-size="11" font-weight="bold" fill="#2c3e50" text-anchor="middle">Master Bath</text>
        <rect x="140" y="390" width="80" height="70" fill="#e0f7fa" stroke="#2c3e50" stroke-width="2"/>
        <text x="180" y="430" font-size="11" font-weight="bold" fill="#2c3e50" text-anchor="middle">Bath 2</text>
        <rect x="220" y="390" width="140" height="70" fill="#fffde7" stroke="#2c3e50" stroke-width="2"/>
        <text x="290" y="430" font-size="12" font-weight="bold" fill="#2c3e50" text-anchor="middle">Verandah</text>
      </g>
      <g id="doors" stroke="#e67e22" stroke-width="3" fill="none">
        <path d="M 40 100 A 30 30 0 0 1 70 100"/>
        <path d="M 220 150 A 25 25 0 0 1 220 175"/>
        <path d="M 120 240 A 25 25 0 0 1 145 240"/>
        <path d="M 250 240 A 25 25 0 0 1 275 240"/>
      </g>
      <g id="windows" stroke="#3498db" stroke-width="4">
        <line x1="80" y1="40" x2="140" y2="40"/>
        <line x1="260" y1="40" x2="320" y2="40"/>
        <line x1="40" y1="280" x2="40" y2="330"/>
        <line x1="360" y1="280" x2="360" y2="330"/>
      </g>
    </svg>`,
  },
  {
    id: "layout-3",
    title: "Luxury Courtyard Villa with Zen Garden",
    floorNumber: 1,
    plotWidth: 60,
    plotHeight: 70,
    totalArea: 4200,
    bedrooms: 3,
    bathrooms: 3,
    utilization: "62.40%",
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="100%" height="100%" style="background-color: #f9f9f9; font-family: 'Segoe UI', Helvetica, Arial, sans-serif;">
      <rect x="0" y="0" width="600" height="700" fill="#f0f4f1" stroke="#bdc3c7" stroke-width="3"/>
      <g id="rooms">
        <rect x="50" y="50" width="220" height="220" fill="#e3f2fd" stroke="#2c3e50" stroke-width="2"/>
        <text x="160" y="150" font-size="16" font-weight="bold" fill="#2c3e50" text-anchor="middle">Formal Living</text>
        <text x="160" y="175" font-size="12" fill="#7f8c8d" text-anchor="middle">484 sq ft</text>
        <rect x="270" y="50" width="160" height="140" fill="#e8f8f5" stroke="#27ae60" stroke-dasharray="5,5" stroke-width="2"/>
        <text x="350" y="115" font-size="13" font-weight="bold" fill="#27ae60" text-anchor="middle">Central Courtyard</text>
        <text x="350" y="135" font-size="11" fill="#7f8c8d" text-anchor="middle">Open to Sky</text>
        <rect x="430" y="50" width="120" height="220" fill="#fff3e0" stroke="#2c3e50" stroke-width="2"/>
        <text x="490" y="150" font-size="14" font-weight="bold" fill="#2c3e50" text-anchor="middle">Kitchen</text>
        <text x="490" y="175" font-size="11" fill="#7f8c8d" text-anchor="middle">264 sq ft</text>
        <rect x="270" y="190" width="160" height="180" fill="#f3e5f5" stroke="#2c3e50" stroke-width="2"/>
        <text x="350" y="275" font-size="14" font-weight="bold" fill="#2c3e50" text-anchor="middle">Dining Area</text>
        <text x="350" y="295" font-size="11" fill="#7f8c8d" text-anchor="middle">288 sq ft</text>
        <rect x="50" y="370" width="240" height="200" fill="#e8f5e9" stroke="#2c3e50" stroke-width="2"/>
        <text x="170" y="465" font-size="15" font-weight="bold" fill="#2c3e50" text-anchor="middle">Master Suite</text>
        <text x="170" y="490" font-size="12" fill="#7f8c8d" text-anchor="middle">480 sq ft</text>
        <rect x="290" y="370" width="260" height="200" fill="#fdfefe" stroke="#2c3e50" stroke-width="2"/>
        <text x="420" y="465" font-size="15" font-weight="bold" fill="#2c3e50" text-anchor="middle">Bedroom 2 & Office</text>
        <text x="420" y="490" font-size="12" fill="#7f8c8d" text-anchor="middle">520 sq ft</text>
        <rect x="50" y="570" width="120" height="80" fill="#e0f7fa" stroke="#2c3e50" stroke-width="2"/>
        <text x="110" y="615" font-size="11" font-weight="bold" fill="#2c3e50" text-anchor="middle">Ensuite Bath</text>
        <rect x="430" y="570" width="120" height="80" fill="#fffde7" stroke="#2c3e50" stroke-width="2"/>
        <text x="490" y="615" font-size="11" font-weight="bold" fill="#2c3e50" text-anchor="middle">Garden Patio</text>
      </g>
      <g id="doors" stroke="#e67e22" stroke-width="4" fill="none">
        <path d="M 50 150 A 35 35 0 0 1 85 150"/>
        <path d="M 270 260 A 30 30 0 0 1 270 290"/>
        <path d="M 430 140 A 30 30 0 0 1 430 170"/>
        <path d="M 170 370 A 30 30 0 0 1 200 370"/>
      </g>
      <g id="windows" stroke="#3498db" stroke-width="5">
        <line x1="90" y1="50" x2="160" y2="50"/>
        <line x1="460" y1="50" x2="520" y2="50"/>
        <line x1="50" y1="440" x2="50" y2="500"/>
        <line x1="550" y1="440" x2="550" y2="500"/>
      </g>
    </svg>`,
  },
];
