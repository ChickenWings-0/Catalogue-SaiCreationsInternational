/**
 * Mapping of the client's product photos → internal product codes (used by import-client-images.mjs).
 * When the client sends more photos: drop them in "IMAGES FOR AKSH/<folder>", add lines here,
 * run `npm run import:images`, then add the matching entries in content/products/*.ts.
 *
 * Codes are INTERNAL only (file names and URLs); they are never shown on the site.
 * Array order inside each category = display order on the site.
 *
 * Modes:
 *   "cutout" (default) – product on white: trim the white margin, centre on a white square
 *   "clean"            – like cutout, ignoring small corner marks in the photo when trimming
 *   "pad"              – product on a plain non-white background (e.g. black): trim on the corner
 *                        colour and pad to a square with that colour (keeps tall items whole)
 *   "crop"             – lifestyle photo: crop to a square around the most interesting area
 *   "fit"              – wide lifestyle photo: whole photo over a blurred copy of itself
 */

export const SOURCE_ROOT = "IMAGES FOR AKSH";

const IMG = (n) => `IMAGES/Untitled - 14 November 2026 at 22.10.52-${n}.png`;
const SEAS = (n) => `SEASONAL DECOR/Untitled - 14 November 2026 at 21.14.04-${n}.png`;
const WALL = (n) => `WALL DECOR/Untitled - 14 November 2026 at 21.58.35-${n}.png`;
const HOME = (n) => `HOME DECOR/HOME DECOR ${n}.jpeg`;
const GARDEN = (n) => `GARDEN DECOR/GARDEN DECOR ${n}.jpeg`;

/** [code, source file, alt text, mode?] */
export const CLIENT_IMAGES = [
  // ─── Home Decor: candelabras (batch 2), then glass terrariums, boxes, trays, vases ───
  ["SCI-HD-013", HOME(7), "Ornate black iron candelabra with five amber tealight glasses"],
  ["SCI-HD-014", HOME(13), "Hexagonal black iron frame with three lit mosaic tealights", "crop"],
  ["SCI-HD-015", HOME(10), "Black scroll iron candelabra with three amber tealight glasses"],
  ["SCI-HD-016", HOME(6), "Five-light iron candelabra with mosaic glass tealights"],
  ["SCI-HD-017", HOME(2), "Black iron candelabra with five tealight holders"],
  ["SCI-HD-018", HOME(12), "Scroll iron candelabra with five lit amber tealights", "fit"],
  ["SCI-HD-019", HOME(3), "Cream iron loop candelabra with three tealights"],
  ["SCI-HD-020", HOME(14), "Black iron ring candelabra with three amber tealights"],
  ["SCI-HD-021", HOME(4), "Black iron frame with five tealight glasses"],
  ["SCI-HD-022", HOME(9), "Five-light candelabra with mosaic glass on a black base"],
  ["SCI-HD-023", HOME(5), "Zigzag black iron tealight holder"],
  ["SCI-HD-001", IMG(17), "Hexagonal brass and glass greenhouse terrarium"],
  ["SCI-HD-002", IMG(2), "Hanging geometric glass terrarium with brass frame"],
  ["SCI-HD-003", IMG(5), "House-shaped brass and glass terrarium"],
  ["SCI-HD-012", IMG(4), "Set of three textured-glass cube lanterns"],
  ["SCI-HD-004", IMG(10), "Hexagonal glass terrarium with brass frame and handle"],
  ["SCI-HD-005", IMG(18), "Hexagonal brass and glass box"],
  ["SCI-HD-006", IMG(8), "Pair of mercury-glass teardrop vases"],
  ["SCI-HD-007", IMG(6), "Hexagonal brass and glass tray"],
  ["SCI-HD-008", IMG(12), "Rectangular brass and glass tray"],
  ["SCI-HD-009", IMG(13), "Long brass and glass display box"],
  ["SCI-HD-011", IMG(15), "Small square glass box with dark metal frame"],
  // (SCI-HD-010, the open glass box, was removed at the client's request.)

  // ─── Outdoor Decor: garden pieces (batch 2), then lanterns ───
  ["SCI-OD-012", GARDEN(1), "Set of four pastel enamel milk churn planters"],
  ["SCI-OD-013", GARDEN(16), "White iron bicycle planter in a garden", "crop"],
  ["SCI-OD-014", GARDEN(2), "Set of four milk churn planters in brown, green, silver and white"],
  ["SCI-OD-015", GARDEN(18), "Coloured glass star lanterns hanging in a garden", "crop"],
  ["SCI-OD-016", GARDEN(3), "Galvanised milk churn planter"],
  ["SCI-OD-017", GARDEN(4), "Galvanised milk churn with embossed fern"],
  ["SCI-OD-018", GARDEN(5), "Galvanised milk churn with embossed grass motif"],
  ["SCI-OD-019", GARDEN(17), "White scroll bicycle planter with flower pots", "crop"],
  ["SCI-OD-020", GARDEN(6), "Pair of oval galvanised planter tubs with embossed design", "clean"],
  ["SCI-OD-021", GARDEN(7), "Pair of oval galvanised tubs with embossed leaf", "clean"],
  ["SCI-OD-022", GARDEN(9), "Pair of oval galvanised tubs with embossed flower", "clean"],
  ["SCI-OD-023", GARDEN(10), "Set of galvanised tubs and a tall vase"],
  ["SCI-OD-024", GARDEN(20), "White galvanised tubs and vase in a garden", "crop"],
  ["SCI-OD-025", GARDEN(19), "Rainbow glass star lantern in a garden", "crop"],
  ["SCI-OD-026", GARDEN(12), "Rust-finish wire gazebo plant stand"],
  ["SCI-OD-027", GARDEN(11), "White wire hanging basket with hook", "pad"],
  ["SCI-OD-028", GARDEN(13), "White wire heart hanging planter with mint pot", "pad"],
  ["SCI-OD-029", GARDEN(14), "Set of three nested white wire baskets", "pad"],
  ["SCI-OD-030", GARDEN(2777), "Polka dot seat cushion on a garden chair", "crop"],
  ["SCI-OD-031", GARDEN(26), "Polka dot seat cushion"],
  ["SCI-OD-032", GARDEN(21), "Strawberry print seat cushion"],
  ["SCI-OD-033", GARDEN(22), "Striped seat cushion"],
  ["SCI-OD-034", GARDEN(23), "Floral print seat cushion on blue"],
  ["SCI-OD-035", GARDEN(24), "Floral print seat cushion on pink"],
  ["SCI-OD-001", IMG(22), "Brass and glass lantern with carry handle"],
  ["SCI-OD-002", IMG(1), "Lantern with red glass panels and domed metal top"],
  ["SCI-OD-003", IMG(16), "Tall hexagonal brass and glass lantern with peaked top"],
  ["SCI-OD-004", IMG(11), "Tall brass lantern with chimney top"],
  ["SCI-OD-005", IMG(3), "Tapered brass and glass lantern with handle"],
  ["SCI-OD-007", IMG(9), "Square brass and glass lantern with hanging ring"],
  ["SCI-OD-008", IMG(19), "Brass and glass lantern with round cap"],
  ["SCI-OD-009", IMG(20), "Brass and glass lantern with pointed top"],
  ["SCI-OD-010", IMG(21), "Square brass lantern with flat cap"],
  ["SCI-OD-011", IMG(7), "Small brass lantern with hinged door"],
  // (SCI-OD-006, the cube lanterns, moved to Home Decor as SCI-HD-012.)

  // ─── Wall Decor ───
  ["SCI-WD-001", WALL(11), "Hanging amber glass star lantern"],
  ["SCI-WD-002", WALL(3), "Tall black iron wall sconce with circle and square motifs"],
  ["SCI-WD-003", WALL(6), "White wire owl family wall planter with four pots"],
  ["SCI-WD-004", WALL(12), "Black iron ring wall sconce with red glass votive"],
  ["SCI-WD-005", WALL(1), "White iron wall sconce with rings and glass candle holder"],
  ["SCI-WD-006", WALL(4), "Black iron wall sconce with square motifs and patterned glass"],
  ["SCI-WD-007", WALL(8), "Wire owl family wall holder with four rings"],
  ["SCI-WD-008", WALL(9), "Black iron wall candle holder with three cups"],
  ["SCI-WD-009", WALL(2), "Black iron ring wall candle holder"],
  ["SCI-WD-010", WALL(5), "Slim black iron wall sconce with square motifs"],
  ["SCI-WD-011", WALL(7), "Black wire owl wall decoration"],
  ["SCI-WD-012", WALL(10), "Black iron wall candle holder with two cups"],

  // ─── Seasonal Decor ───
  ["SCI-SD-001", SEAS(19), "Silver wire reindeer"],
  ["SCI-SD-002", SEAS(22), "Seven-point brass and glass star lantern"],
  ["SCI-SD-003", SEAS(16), "Wire JOY letters"],
  ["SCI-SD-004", SEAS(1), "White wire Christmas tree with scroll pattern"],
  ["SCI-SD-005", SEAS(2), "Gold wire Christmas tree with star topper"],
  ["SCI-SD-006", SEAS(6), "Pair of green bottle-brush trees"],
  ["SCI-SD-007", SEAS(14), "Red cone Christmas tree"],
  ["SCI-SD-008", SEAS(20), "Set of three wire scroll decorations on stands"],
  ["SCI-SD-009", SEAS(3), "Silver twig tree on a round base"],
  ["SCI-SD-010", SEAS(4), "Gold wire cone tree with bauble top"],
  ["SCI-SD-011", SEAS(5), "Silver branch tree on a round base"],
  ["SCI-SD-012", SEAS(7), "Silver filigree Christmas tree with star"],
  ["SCI-SD-013", SEAS(8), "Layered silver filigree Christmas tree"],
  ["SCI-SD-014", SEAS(9), "Tall silver wire cone tree"],
  ["SCI-SD-015", SEAS(10), "Small silver wire tree with star"],
  ["SCI-SD-016", SEAS(11), "White tiered wire Christmas tree with star"],
  ["SCI-SD-017", SEAS(12), "Beaded white and gold cone tree with star"],
  ["SCI-SD-018", SEAS(13), "Wire Christmas tree tealight holder with star"],
  ["SCI-SD-019", SEAS(15), "Silver beaded cone tree with star"],
  ["SCI-SD-020", SEAS(17), "Slim tiered silver wire tree with star"],
  ["SCI-SD-021", SEAS(18), "Silver wire cone tree"],
  ["SCI-SD-022", SEAS(21), "Small brass and glass star lantern"],
];

/** Shown in the Home "Featured pieces" section (interleaved across categories). */
export const FEATURED = [
  "SCI-HD-013",
  "SCI-HD-001",
  "SCI-OD-012",
  "SCI-OD-001",
  "SCI-WD-001",
  "SCI-WD-002",
  "SCI-SD-001",
  "SCI-SD-002",
];
