await import(`./src/${location.hash.substring(1) || "cell"}.ts`)

addEventListener("hashchange", () => {
    location.reload()
})