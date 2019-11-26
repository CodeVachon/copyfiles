import { readdirSync, statSync, copyFileSync } from "fs";
import { sep, dirname } from "path";
import mkdirp from "mkdirp";

interface IcopyFilesResponse {
    /**
     * The Number of Files Copied
     */
    filesCopied: number;
    /**
     * An Array of all of the Copied File Paths
     */
    files: string[];
} // close IcopyFilesResponse

interface IcopyFilesOptions {
    /**
     * Use this Regular Expression to Filter only the files you want to copy
     * ```js
     * // Select only jpg files
     * return copyfiles(source, destination, {
     *     filter: new RegExp("\.jpg$", "i");
     * })
     * ```
     */
    filter: RegExp
} // close IcopyFilesOptions


interface IdirStats {
    /**
     * The Folder Path
     */
    path: string;
    /**
     * The File Name
     */
    name: string;
    /**
     * Is this a Directory
     */
    isDirectory: boolean;
    /**
     * If this is a Directory, This is its children
     */
    files: IdirStats[];
} // close IdirStats

/**
 * Copy Files from one Directory to Another
 * @param source The Source Path of for the files
 * @param destination The Destination Path for the files
 * @param options Options to be used
 */
function copyFiles(source: string, destination: string, options?: IcopyFilesOptions): Promise<IcopyFilesResponse> {
    if (String(source).length <= 0) {
        return Promise.reject(new Error("invalid source was passed"));
    }
    if (String(destination).length <= 0) {
        return Promise.reject(new Error("invalid destination was passed"));
    }

    const settings: IcopyFilesOptions = {
        filter: new RegExp(".+"),
        ...options
    }

    const getDirectoryData = (thisPath: string): any => {
        let flatValues: any[] = [];

        readdirSync(thisPath, "utf-8").map(name => {
            const stats = statSync(`${thisPath}${sep}${name}`);
            let subFiles: IdirStats[] = [];

            if (stats.isDirectory()) {
                subFiles = subFiles.concat(getDirectoryData(`${thisPath}${sep}${name}${sep}`));
            }

            return {
                path: thisPath.replace(new RegExp(`${sep}{1,}$`), "") + sep,
                name: name,
                isDirectory: stats.isDirectory(),
                files: subFiles
            };
        }).forEach(value => {
            if (value.isDirectory) {
                flatValues = flatValues.concat(value.files.map(thisFile => {
                    return `${thisFile.path}${thisFile.name}`
                }))
            } else {
                flatValues = flatValues.concat(value);
            }
        });

        return flatValues;
    }; // close getDirectoryData

    return new Promise(async (resolve, reject) => {
        const dirValues = getDirectoryData(source).map((value: string | IdirStats): string => {
            if (typeof value !== "string") {
                return `${value.path}${value.name}`;
            } else {
                return value;
            }
        }).filter((value: string) => settings.filter.test(value));

        mkdirp(destination, (error: Error) => {
            const copies = [];

            if (error) {
                reject(error);
            } else {
                try {
                    for (let i=0; i < dirValues.length; i++) {
                        const filepath = dirValues[i];
                        const thisDestination = filepath.replace(source, destination);

                        mkdirp.sync(dirname(thisDestination));
                        copyFileSync(filepath, thisDestination);
                        copies.push(thisDestination);
                    }
                } catch(error) {
                    return reject(error);
                }

                resolve(<IcopyFilesResponse> {
                    filesCopied: 0,
                    files: copies
                });
            }
        });
    });
} // close copyFiles

export default copyFiles;
