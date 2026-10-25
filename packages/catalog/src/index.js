export const byDepartment=(cards,d)=>cards.filter(c=>c.department===d);
export const byRarity=(cards,r)=>cards.filter(c=>c.rarity===r);
export const bySlug=(cards,s)=>cards.find(c=>c.slug===s);
