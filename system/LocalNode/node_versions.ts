export type node_version_info = {
    "version": string;
    "date": string;
    "files": node_fileType[];
    "npm"?: string;
    "v8": string;
    "uv"?: string;
    "zlib"?: string;
    "openssl"?: string;
    "modules?": string;
    "lts": boolean;
    "security": boolean;
}

type node_fileType = "aix-ppc64" | "headers" | "linux-arm64" | "linux-ppc64le" | "linux-s390x" | "linux-x64" | "osx-arm64-tar" | "osx-x64-pkg" | "osx-x64-tar" | "src" | "win-arm64-7z" | "win-arm64-zip" | "win-x64-7z" | "win-x64-exe" | "win-x64-msi" | "win-x64-zip"