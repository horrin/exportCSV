var fs = require('fs');
// var api = require('./api');

// var data = [{
//     id: 1,
//     name: 'Harshal',
//     subjects: [{
//         id: 1,
//         name: 'English',
//         chapters: [{
//             id: 1,
//             name: 'Grammar'
//         }, {
//             id: 2,
//             name: 'Comprehension'
//         }]
//     }, {
//         id: 2,
//         name: 'Maths',
//         chapters: [{
//             id: 1,
//             name: 'Algebra'
//         }, {
//             id: 2,
//             name: 'Geometry'
//         }]
//     }]
// }, {
//     id: 2,
//     name: 'Pankaj',
//     subjects: [{
//         id: 3,
//         name: 'Marathi',
//         chapters: [{
//             id: 1,
//             name: 'Kavita',
//             topics: [{
//                 id: 1,
//                 name: 'Topic 1'
//             }]
//         }]
//     }, {
//         id: 4,
//         name: 'Hindi',
//         chapters: [{
//             id: 1,
//             name: 'Katha',
//             topics: [{
//                 id: 2,
//                 name: 'Topic 2'
//             }, {
//                 id: 3,
//                 name: 'Topic 3'
//             }]
//         }]
//     }]
// }];

// var data=api.searchAssortmentTotal(398)
// .then(data=>{data=data.results;return data;});

function unravel(obj) {
    var out = [];
    var added = false;
    for (var i in obj) {
        if (obj[i] instanceof Array) {
            for (var j in obj[i]) {
                var r = unravel(obj[i][j]);
                for (var k in r) {
                    var a = {};
                    for (var key in obj) { // make copy of obj
                        a[key] = obj[key];
                    }
                    a[i] = r[k];
                    added = true;
                    out.push(a);
                }
            }
        }
    }
    if (!added) {
        out.push(obj);
    }
    return out;
}

var path = ['data'];

function traverse(obj, func, parent) {

    for (i in obj) {
        func.apply(this, [i, obj[i], parent]);
        if (obj[i] instanceof Object && !(obj[i] instanceof Array)) {
            path.push(i);
            traverse(obj[i], func, i);
            path.pop();

        }
    }

}
var getClassOf = Function.prototype.call.bind(Object.prototype.toString);

function printNode(key, value, parent) {
    if (typeof value !== "object") {
        //console.log('---------------------------------------parent >'+parent+"."+key+": ("+getClassOf(value)+")"+value);
        //console.log(path.join('.'));
        let fieldName = path.join('.') + "." + key;
        flatten[fieldName] = value;
        if (column.indexOf(fieldName) < 0)
            column.push(fieldName);

        line.push(value);
        //console.log(flatten);
    }
}

let line = [];
let flatten = {};
let result = '';
let resultFlatten = [];
let column = [];



function exportExcel(data) {
    // console.log("data: " + data);

    var op = [];
    for (var i in data)
        op = op.concat(unravel(data[i]));
    console.log('unwind completed');



    for (let k in op) {
        traverse(op[k], printNode, op[k]);
        resultFlatten.push(flatten);
        //result = result.concat(line.join()+'\n');
        line = [];
        //    console.log(flatten);
        flatten = {};

    }

    //console.log('column: '+column+'\n');
    result = result.concat(column.join() + '\n');

    for (let resultFlattenKey in resultFlatten) {
        //  console.log('resultObj: '+ JSON.stringify(resultFlatten[resultFlattenKey]));
        let resultObj = resultFlatten[resultFlattenKey];
        for (let i in column) {
            let columnKey = column[i]
            //console.log('columnKey: '+ columnKey);

            if (resultObj[columnKey])
                line.push(resultObj[columnKey])
            else {
                line.push('');
            }
        }
        result = result.concat(line.join() + '\n')
        //console.log('line: '+line);
        line = [];
    }

    // fs.readdir('../public/files');
    // console.log(__dirname);

    // fs.writeFile(path, result, function(err) {

    //     if(err) {
    //         return console.log(err);
    //     }

    //     console.log("The file was saved!");
    //     return new Promise(function(resolve, reject){
    // resolve(path);
    //     });
    // });
    return result;
}

const WriteFile = (path, result) => new Promise((resolve, reject) => {
    return fs.writeFile(path, result, function (err) {
        if (err) {
            reject(err);
        }
        console.log("The file was saved!");
        resolve(path);
    });
})

const fixedJson = (datas) => {
    datas.map(function (data) {
        data.styles.map(function (style) {
            if (style.sizes.labels.length > 1) {
                style.sizes.availableSizes.map(function (availableSize) {
                    let combineSizes = availableSize.join('/');
                    availableSize.splice(0, availableSize.length);
                    availableSize.push(combineSizes);
                });
                style.data.map(function (colorway) {
                    colorway.buyPeriod.map(function (buyPeriod) {
                        buyPeriod.buyPeriodMarket.map(function (buyPeriodMarket) {
                            buyPeriodMarket.buyPeriodStore.map(function (buyPeriodStore) {
                                buyPeriodStore.sizes.map(function (size) {
                                    let combineSizes = size.sizeLabel.join('/');
                                    size.sizeLabel.splice(0, size.sizeLabel.length);
                                    size.sizeLabel.push(combineSizes);
                                });
                            });
                        });
                    });
                });
            }
        });
    });

    return datas;
}

module.exports = { exportExcel, WriteFile, fixedJson };
