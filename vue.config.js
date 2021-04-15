module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/styles/globals.scss";
          @import '~@fortawesome/fontawesome-free/scss/fontawesome';
          @import '~@fortawesome/fontawesome-free/scss/solid';

        `
      }
    }
  }
}

