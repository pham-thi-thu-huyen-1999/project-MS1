import { FileType } from '../app/model/common/CommonType';
export default class FileHelper {
    static toDataURL(url: string): Promise<string>;
    static downloadFile(fileUrl: string, destPath: string): Promise<any>;
    static createDirPath(path: string): Promise<any>;
    static getFileTypeByExtension(extension: string): FileType | null;
    static checkURLExist(url: string): Promise<boolean>;
    static getFileNameWithoutExtension(filePath: any): any;
    static updateFileNameFromUrl(fileUrl: any, newName: any): any;
    static move(src: string, dest: string): Promise<any>;
    static getFileNameFromUrlWithoutExtension(url: string): string;
    static getDirectories: (sourcePath: string) => Promise<string[]>;
    static getDirectoriesSync: (sourcePath: string) => string[];
    static getFiles: (sourcePath: string) => Promise<string[]>;
    static getFilesSync: (sourcePath: string) => string[];
    static getFileContent: (path: any) => Promise<string>;
    static writeFile: (path: string, content: string) => Promise<{}>;
    static moveFilesByOwner: (idOwner: string, files: any, isVideo?: boolean | undefined, destPath?: string | undefined) => Promise<any>;
    static removeFile: (sourcePath: string) => void;
}
