import fuse = require("fuse.js");
import eve = require("eve-online-sde");

export const fusedTypes: Promise<fuse> = eve.types().then(t => {
    return new fuse(Object.keys(t).map(k => (t[k].id = k, t[k])), {
        caseSensitive: false,
        keys: ["name.en"],
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        includeScore: true
    });
});