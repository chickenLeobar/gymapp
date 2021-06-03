import { Vimeo } from "vimeo";

/**
 *
 * setup vimeo sdk :  https://developer.vimeo.com/api/guides/start
 *
 */
export const TOKENVIMEO = "15bc544c60e32e7b825f8d689be15c59";
export const CLIENTID = "684c07cdafa318a4a6ad6bb21a8d795a931a0dc5";
export const SECRET =
  "BmoiADgjpi4VJhtCU3jqeCf2pTNhdDXoKgMNGn2zwFkxCED3j8O5SX2P51mlPzOfY3ggVYJMQza2ihqXTe34l9BKQGvqaK6fuXO4AwjBS49RI2Z8u7y8S5L5p1RXvwOD";
export const client = new Vimeo(CLIENTID, SECRET, TOKENVIMEO);
