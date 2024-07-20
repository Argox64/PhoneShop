import { isNullOrEmpty, tryParseInt } from "../../app/utils/extensions/stringExtensions";

describe("--- String Extensions Tests ---", () => {
    it("[tryParseInt]: Test correct integer strings", () => {
        expect(tryParseInt("  2").parsed).toBeTruthy();
        expect(tryParseInt("2444.").parsed).toBeTruthy();
        expect(tryParseInt("254545").parsed).toBeTruthy();
        expect(tryParseInt("00995").parsed).toBeTruthy();
        expect(tryParseInt("01010101").parsed).toBeTruthy(); 
    });
    it("[tryParseInt]: Test incorrect integer strings", () => {
        expect(tryParseInt("2m2jkjk1").parsed).toBeTruthy();
        expect(tryParseInt("azd").parsed).toBeFalsy();
        expect(tryParseInt("vbv20d0§a").parsed).toBeFalsy();
        expect(tryParseInt("g 1").parsed).toBeFalsy();
        expect(tryParseInt("mlkkj").parsed).toBeFalsy(); 
    });
    it("[tryParseInt]: Test float strings", () => {
        let rtrn = tryParseInt("2.5")
        expect(rtrn.parsed).toBeTruthy();
        expect(rtrn.value).toBe(2);
        
        rtrn = tryParseInt("9.999999")
        expect(rtrn.parsed).toBeTruthy();
        expect(rtrn.value).toBe(9);
    });
    it("[isNullOrEmpty]: Test string is null or empty", () => {
        let s : string = "";
        let s2 : string = "   ";
        let s3 : string = " d ";
        let s4 : string = ".";
        let s5 : undefined;
        expect(isNullOrEmpty(s)).toBeTruthy();
        expect(isNullOrEmpty(s2)).toBeTruthy();
        expect(isNullOrEmpty(s3)).toBeFalsy();
        expect(isNullOrEmpty(s4)).toBeFalsy();
        expect(isNullOrEmpty(s5)).toBeTruthy();
    });
});