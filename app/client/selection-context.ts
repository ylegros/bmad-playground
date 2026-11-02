export interface SelectionContext {
 snapshot:unknown;category:string;season:number|undefined;view:string;generation:number;
}

export function applyCurrentSelection(expected:SelectionContext,current:SelectionContext,apply:()=>void) {
 if(expected.snapshot!==current.snapshot||expected.category!==current.category||expected.season!==current.season||expected.view!==current.view||expected.generation!==current.generation)return false;
 apply();return true;
}
