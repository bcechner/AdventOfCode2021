"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var Display = /** @class */ (function () {
    function Display(input) {
        var _a = input.split(" | "), signalPatterns = _a[0], digits = _a[1];
        this.inputs = signalPatterns.split(" ").map(function (s) {
            var sortedPattern = s.split("");
            return new SegmentPattern(sortedPattern);
        });
        this.outputs = digits.split(" ").map(function (d) {
            var sortedPattern = d.split("");
            return new SegmentPattern(sortedPattern);
        });
        this.mappings = new Map();
    }
    Object.defineProperty(Display.prototype, "outputs", {
        get: function () {
            return this._outputs;
        },
        set: function (value) {
            this._outputs = value;
        },
        enumerable: false,
        configurable: true
    });
    Display.prototype.decode = function () {
        var one = this.inputs.find(function (s) { return s.segments.length === 2; });
        var four = this.inputs.find(function (s) { return s.segments.length === 4; });
        var seven = this.inputs.find(function (s) { return s.segments.length === 3; });
        var eight = this.inputs.find(function (s) { return s.segments.length === 7; });
        var remainingInputs = this.inputs.filter(function (i) {
            return (i.asString !== one.asString &&
                i.asString !== four.asString &&
                i.asString !== seven.asString &&
                i.asString !== eight.asString);
        });
        // a is the difference between 1 and 7
        var a = seven.segments.filter(function (x) { return !one.segments.includes(x); })[0];
        // All segments (without 1, 4 and 7) have g and a
        var aOrG = eight.segments.filter(function (s) {
            return remainingInputs.every(function (remainingInput) { return remainingInput.segments.indexOf(s) !== -1; });
        });
        var g = aOrG.filter(function (s) { return s !== a; })[0];
        // 9 is 4 with a and g
        var nine = new SegmentPattern(__spreadArray(__spreadArray([], four.segments), [a, g]));
        remainingInputs = remainingInputs.filter(function (i) { return i.asString !== nine.asString; });
        // e is the difference between 8 and 9
        var e = eight.segments.filter(function (x) { return !nine.segments.includes(x); })[0];
        // 5 and 6 differ only by e (6 has the e)
        var six = remainingInputs.filter(function (remainingInput) {
            return remainingInputs.some(function (cousinInput) {
                return remainingInput.asString !== cousinInput.asString &&
                    remainingInput.asString ===
                        new SegmentPattern(__spreadArray(__spreadArray([], cousinInput.segments), [e])).asString;
            });
        })[0];
        var five = new SegmentPattern(this.remove(__spreadArray([], six.segments), e));
        remainingInputs = remainingInputs.filter(function (i) { return i.asString !== five.asString && i.asString !== six.asString; });
        // c is the difference between 6 and 8
        var c = eight.segments.filter(function (x) { return !six.segments.includes(x); })[0];
        // 0 is the other input with 6 segments
        var zero = remainingInputs.filter(function (remainingInput) {
            return remainingInput.asString !== six.asString &&
                remainingInput.asString !== nine.asString &&
                remainingInput.segments.length === 6;
        })[0];
        remainingInputs = remainingInputs.filter(function (i) { return i.asString !== zero.asString; });
        // d is the difference between 0 and 8
        var d = eight.segments.filter(function (x) { return !zero.segments.includes(x); })[0];
        // 2 is acdeg
        var two = new SegmentPattern([a, c, d, e, g]);
        remainingInputs = remainingInputs.filter(function (i) { return i.asString !== two.asString; });
        // 3 is whatever remains
        var three = remainingInputs[0];
        this.mappings.set(zero.asString, "0");
        this.mappings.set(one.asString, "1");
        this.mappings.set(two.asString, "2");
        this.mappings.set(three.asString, "3");
        this.mappings.set(four.asString, "4");
        this.mappings.set(five.asString, "5");
        this.mappings.set(six.asString, "6");
        this.mappings.set(seven.asString, "7");
        this.mappings.set(eight.asString, "8");
        this.mappings.set(nine.asString, "9");
    };
    Display.prototype.readDisplay = function () {
        if (this.mappings.size === 0) {
            throw new Error("A display cannot be read until it is decoded.");
        }
        var decodedDisplay = "";
        for (var _i = 0, _a = this.outputs; _i < _a.length; _i++) {
            var output = _a[_i];
            decodedDisplay += this.mappings.get(output.asString);
        }
        return Number(decodedDisplay);
    };
    Display.prototype.remove = function (array, element) {
        var elementIndex = array.indexOf(element);
        array.splice(elementIndex, 1);
        return array;
    };
    return Display;
}());
var SegmentPattern = /** @class */ (function () {
    function SegmentPattern(segments) {
        this.segments = segments.sort();
        this._asString = this.segments.join("");
    }
    Object.defineProperty(SegmentPattern.prototype, "asString", {
        get: function () {
            return this._asString;
        },
        set: function (value) {
            this._asString = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SegmentPattern.prototype, "segments", {
        get: function () {
            return this._segments;
        },
        set: function (value) {
            this._segments = value;
        },
        enumerable: false,
        configurable: true
    });
    return SegmentPattern;
}());
var inputs;
var rawData = fs_1.readFileSync("./day8inputs.txt", "utf8");
inputs = rawData.split("\r\n");
var displays = inputs.map(function (i) { return new Display(i); });
var displayTotal = 0;
for (var _i = 0, displays_1 = displays; _i < displays_1.length; _i++) {
    var display = displays_1[_i];
    display.decode();
    displayTotal += display.readDisplay();
}
console.log(displayTotal);
//# sourceMappingURL=day8question2.js.map