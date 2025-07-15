import { rep } from "./_rep";
import { rep_plugin } from "./_rep_plugin";



export type ModuleRepository_type<REP=rep, PREP=rep_plugin> = {
    register(name: string, data: any): boolean;
    
    get<K extends keyof REP> (name: K): REP[K];

    getAsync<K extends keyof (REP & PREP)> (name: K): Promise<(REP&PREP)[K]>;
}