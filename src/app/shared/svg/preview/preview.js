const fs = require('fs');
const path = 'src/app/shared/svg/';
const definitionFile = path + 'svg-definition.component.html';
const styleFile = path + 'preview.css';
const outputFile = path + 'preview.html';

const fileHtml = new Promise((resolve, reject) => {
  fs.readFile(definitionFile, 'utf8', function (err, svgDefinitions) {
    if (err) {
      reject(err);
    }
    const svgTransformed = svgDefinitions
      .substring(0, svgDefinitions.lastIndexOf('</defs>'))
      .substring(svgDefinitions.indexOf('<symbol'))
      .trim()
      .replace(/symbol/g, 'use')
      .replace(/id="/g, 'xlink:href="#');

    let svgSymbols = svgTransformed.split('</use>');
    svgSymbols.forEach((symbol, index, symbols) => {
      if (symbol === '') {
        symbols.splice(index, 1);
        return;
      }
      const symbolName = symbol.split('href="#')[1].split('"')[0];
      symbols[index] = `<div class="l-grid__item">
                          <svg class="o-ico">${symbol}</use></svg>
                          <span class="o-ico-id">${symbolName}</span>
                      </div>`;
    });
    svgSymbols = svgSymbols.join('');

    const svgData = `
        <div class="l-container">
            <h1 class="o-title">Ico list</h1>
            <div class="u-hide">${svgDefinitions}</div>
            <div class="l-grid">${svgSymbols}</div>
        </div>`;

    resolve(svgData);
  });
});

const fileStyles = new Promise((resolve, reject) => {
  fs.readFile(styleFile, 'utf8', function (err, styles) {
    if (err) {
      reject(err);
    }
    resolve(styles);
  });
});

Promise.all([fileStyles, fileHtml]).then(
  ([styles, html]) => {
    const result = `<style>${styles}</style>${html}`;
    fs.writeFile(outputFile, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  },
  error => {
    console.log(error);
  }
);
