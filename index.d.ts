export declare function printSourceTrace(sourceUri: string): void;
export declare function getOriginalSourceTrace(sourceUri: string, callback: OriginalSourceCallback): void;
export interface IOriginalSourceTrace {
    sourcePath: string;
    sourceLine: number;
    sourceColumn: number;
    sourceCode: string;
}
export interface OriginalSourceCallback {
    (error: any, originalSource: IOriginalSourceTrace): void;
}
