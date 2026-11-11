// Registre des schémas (sur le parchemin) et des manipulations pop-up, appelés par leur nom dans config/contenu.json.
import { schemaAngleCentre, popupCercle50 } from "./etape4.js";
import { popupNavire, popupEtoiles, popupEclipses } from "./ouverture.js";
import { popupPuits } from "./etape1.js";
import { popupRapporteur } from "./etape2.js";
import { popupAngleCentre } from "./etape3.js";
import { schemaArcMeridien, popupPuissances } from "./partie2.js";

export const SCHEMAS = { "angle-centre": schemaAngleCentre, "arc-meridien": schemaArcMeridien };
export const POPUPS = {
  "cercle-50": popupCercle50,
  "navire": popupNavire,
  "etoiles": popupEtoiles,
  "eclipses": popupEclipses,
  "puits": popupPuits,
  "rapporteur": popupRapporteur,
  "angle-centre": popupAngleCentre,
  "puissances": popupPuissances,
};
