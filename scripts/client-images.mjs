/**
 * Mapping of the client's product photos → product codes (used by import-client-images.mjs).
 * When the client sends more photos: drop them in "IMAGES FOR AKSH/<folder>", add lines here,
 * run `npm run import:images`, then add the matching entries in content/products/*.ts.
 *
 * TODO(client): codes are provisional (SCI-<CAT>-<NNN>). Replace with the client's own
 * product codes if they have them.
 */

export const SOURCE_ROOT = "IMAGES FOR AKSH";

const IMG = (n) => `IMAGES/Untitled - 14 November 2026 at 22.10.52-${n}.png`;
const SEAS = (n) => `SEASONAL DECOR/Untitled - 14 November 2026 at 21.14.04-${n}.png`;
const WALL = (n) => `WALL DECOR/Untitled - 14 November 2026 at 21.58.35-${n}.png`;

/** [code, source file, alt text] */
export const CLIENT_IMAGES = [
  // ─── Home Decor: terrariums, glass boxes, trays, vases (from the "IMAGES" folder) ───
  ["SCI-HD-001", IMG(17), "Hexagonal brass and glass greenhouse terrarium"],
  ["SCI-HD-002", IMG(2), "Hanging geometric glass terrarium with brass frame"],
  ["SCI-HD-003", IMG(5), "House-shaped brass and glass terrarium"],
  ["SCI-HD-004", IMG(10), "Hexagonal glass terrarium with brass frame and handle"],
  ["SCI-HD-005", IMG(18), "Hexagonal brass and glass box"],
  ["SCI-HD-006", IMG(8), "Pair of mercury-glass teardrop vases"],
  ["SCI-HD-007", IMG(6), "Hexagonal brass and glass tray"],
  ["SCI-HD-008", IMG(12), "Rectangular brass and glass tray"],
  ["SCI-HD-009", IMG(13), "Long brass and glass display box"],
  ["SCI-HD-010", IMG(14), "Brass and glass box with hinged lid"],
  ["SCI-HD-011", IMG(15), "Small square glass box with dark metal frame"],

  // ─── Outdoor Decor: lanterns (from the "IMAGES" folder) ───
  ["SCI-OD-001", IMG(22), "Brass and glass lantern with carry handle"],
  ["SCI-OD-002", IMG(1), "Lantern with red glass panels and domed metal top"],
  ["SCI-OD-003", IMG(16), "Tall hexagonal brass and glass lantern with peaked top"],
  ["SCI-OD-004", IMG(11), "Tall brass lantern with chimney top"],
  ["SCI-OD-005", IMG(3), "Tapered brass and glass lantern with handle"],
  ["SCI-OD-006", IMG(4), "Set of three textured-glass cube lanterns"],
  ["SCI-OD-007", IMG(9), "Square brass and glass lantern with hanging ring"],
  ["SCI-OD-008", IMG(19), "Brass and glass lantern with round cap"],
  ["SCI-OD-009", IMG(20), "Brass and glass lantern with pointed top"],
  ["SCI-OD-010", IMG(21), "Square brass lantern with flat cap"],
  ["SCI-OD-011", IMG(7), "Small brass lantern with hinged door"],

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
