'use strict';

angular.module('naanalkart')

       .controller('LoginController', function($scope){

        })
       .controller('OrderListController', function($scope,OrderService){
            OrderService.getOrders().then(function(response) {
                $scope.orders = response;
            });
            $scope.print = function(order){
                var bar1 = getBarCode(order.DocketNo);
                var bar2 = getrotatedBarCode(order.OrderNo);
                console.log(bar1);
                console.log(bar2);
                //var pdfD = pdfDefination(order);
            }
            
        })

function getBarCode(text)
{
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text);
    return canvas.toDataURL("image/png");
}

function getrotatedBarCode(text)
{
    var getBar = getBarCode(text)
    var tempImage = new Image();
    tempImage.src = getBar;
    var rotatedBarcodeCanvas = document.createElement("canvas");
    var rotatedBarcodeCanvasContext = rotatedBarcodeCanvas.getContext("2d");
    rotatedBarcodeCanvas.width = tempImage.height;
    rotatedBarcodeCanvas.height = tempImage.width;
    rotatedBarcodeCanvasContext.translate(tempImage.height, 0);
    rotatedBarcodeCanvasContext.rotate(90 * Math.PI / 180);
    rotatedBarcodeCanvasContext.drawImage(tempImage, 0, 0);
    return rotatedBarcodeCanvas.toDataURL("image/png");
    
}

function pdfDefination(order){
    
}