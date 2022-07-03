// var arr = [1,2,3,4,5,6,7,8];
var arr = [2,1,5,7,4,3,2,8];

arr.sort(function (a,b) {
    return Math.random() - 0.5;
});

function test(a, b) {
    return b - a > 0;
}
function mySort(arr) {
    for (var i = 0 ; i < arr.length ; i ++) {
        for (var j = 0; j < arr.length - 1 ; j ++) {
            if (test(arr[j], arr[j + 1])) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

console.log(mySort(arr));