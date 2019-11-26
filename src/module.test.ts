import copyfiles from "./module";
import { resolve } from "path";
import fs from "fs";

const source = resolve(__dirname, "./../test-dir");
const destination = resolve(__dirname, "./../test-destination");

const rmrf = function(dirPath: string) {
    if (fs.existsSync(dirPath)) {
        const stats = fs.statSync(dirPath);
        if (stats.isDirectory()) {
            var files = fs.readdirSync(dirPath);
            if (files && files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var filePath = dirPath + '/' + files[i]
                    if (fs.lstatSync(filePath).isDirectory()) {
                        rmrf(filePath);
                    } else {
                        fs.unlinkSync(filePath);
                    }
                }
            }
            fs.rmdirSync(dirPath);
        } else {
            fs.unlinkSync(dirPath);
        }
    }
} // close rmrf

afterEach(() => {
    return rmrf(destination);
});

describe("Copy Files", () => {
    test("theows and error is source is not valid", () => {
        return copyfiles("", "./dest").then(() => {
            throw new Error("Expected Error");
        }).catch(error => {
            expect(error.message).toMatch(new RegExp("source"));
        });

    });
    test("theows and error is destination is not valid", () => {
        return copyfiles("./source", "").then(() => {
            throw new Error("Expected Error");
        }).catch(error => {
            expect(error.message).toMatch(new RegExp("destination"));
        });
    });

    test("copies files from source to destination", () => {
        return copyfiles(source, destination).then((result) => {
            expect(result).toBeTruthy();

            result.files.forEach(filepath => {
                expect(fs.existsSync(filepath)).toEqual(true);
            });
        });
    });

    test("copies filtered files from source to destination", () => {
        const filterRegExp = new RegExp("\.jpg$", "i");

        return copyfiles(source, destination, {
            filter: filterRegExp
        }).then((result) => {
            expect(result).toBeTruthy();
            expect(result.files).toContainEqual(expect.stringMatching(filterRegExp));

            result.files.forEach(filepath => {
                expect(fs.existsSync(filepath)).toEqual(true);
            });
        });
    });
});
