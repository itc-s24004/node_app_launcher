export type rep = {
    /**パッケージをダウンロードします */
    npm_install: (dir: string) => Promise<{code: number | null, signal: NodeJS.Signals | null}>;
    local_node: string;
}