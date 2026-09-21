export const requiredFields=['id','slug','name','department','agent_function','rarity','workflow','stats'];
export function validateCard(c){return requiredFields.filter(k=>!(k in c));}
