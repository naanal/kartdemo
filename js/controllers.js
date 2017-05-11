'use strict';

angular.module('naanalkart')

    .controller('LoginController', function ($scope) {

    })
    .controller('OrderListController', function ($scope, OrderService, $uibModal, $log, $rootScope) {
    
        $scope.idSelectedOrder = null;
    
        $rootScope.gettingOrders = function () {
            OrderService.getOrders().then(function (response) {
                $scope.orders = response;
            });
        }
        $rootScope.gettingOrders();
        $scope.processLabel = function (order, mode, idSelectedOrder) {
            $scope.idSelectedOrder = idSelectedOrder;
            var bar1, bar2, bar2_rotated;
            bar1 = getBarCode(order.DocketNo);
            bar2 = getBarCode(order.OrderNo);
            ProcessPdf(order, bar1, bar2, mode);

        }

        $scope.openModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'partials/import.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg'
            });

            modalInstance.result.then(function () {
                console.log('success')
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    })

    .controller('ModalInstanceCtrl', function ($uibModalInstance, $scope, OrderService,$rootScope) {

        $scope.isShow = false;
        $scope.newOrders = {};
        $scope.enableTable = function () {
            $scope.isShowTable = true;
        }
        $scope.uploadFiles = function (file) {
            $scope.isShow = true;
            if (file) {
                $scope.f = file;
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function (results, file, err) {
                        $scope.newOrders = results.data;
                    }
                });

            }
        }

        $scope.save = function () {

            for (var i = 0; i < $scope.newOrders.length; i++) {
                OrderService.postOrders($scope.newOrders[i]).then(function (response) {

                });
            }
            $rootScope.gettingOrders();
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    
    })

function getBarCode(text) {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text);
    return canvas.toDataURL("image/png");
}

function ProcessPdf(order, bar1, dataURI, mode) {

    var tempImage = new Image();
    tempImage.src = dataURI;
    tempImage.onload = function () {
        var rotatedBarcodeCanvas = document.createElement("canvas");
        var rotatedBarcodeCanvasContext = rotatedBarcodeCanvas.getContext("2d");
        rotatedBarcodeCanvas.width = tempImage.height;
        rotatedBarcodeCanvas.height = tempImage.width;
        rotatedBarcodeCanvasContext.translate(tempImage.height, 0);
        rotatedBarcodeCanvasContext.rotate(90 * Math.PI / 180);
        rotatedBarcodeCanvasContext.drawImage(tempImage, 0, 0);
        var bar2_rotated = rotatedBarcodeCanvas.toDataURL("image/png");
        var pdfData = pdfDefination(order, bar1, bar2_rotated);
        pdfMake.createPdf(pdfData).getDataUrl(function (result) {
            $('#pdfView').attr('src', result);
        });


        if (mode != 'view') {
            if (mode == 'print') {
                var win = window.open('', '_blank');
                pdfMake.createPdf(pdfData).print({}, win);
            } else if (mode == 'download') {
                var filename = order.DocketNo + '.pdf'
                pdfMake.createPdf(pdfData).download(filename);
            }
        }
    }

}

function pdfDefination(order, bar1, bar2) {
    var dd = {
        pageSize: 'A6',
        pageMargins: [10, 10, 10, 10],
        info: {
            title: order.DocketNo,
            author: 'naanalKart'
        },
        content: [
            {
                image: bar1,
                width: 200,
                height: 70
        },
            {
                style: 'receiverStyle',
                columns: [
                [
                        {
                            text: 'Ship To:',
                            fontSize: 12
                    },
                  order.ReceiverName,
                  order.ReceiverAddress1 + ' ' + order.ReceiverAddress2,
                  order.ReceiverAddress3,
                  order.ReceiverCity + ' ' + order.ReceiverPinCode,
                  order.ReceiverState,
                  'Ph: ' + order.ReceiverPhone,
                  'LandMark: ' + order.ReceiverLandmark
                ],
                    {
                        width: 80,
                        style: 'desCode',
                        text: order.DestStationCode

                }
            ]
		},
            {
                text: "__________________________________________________________"
        },
            {
                columns: [
                    {
                        width: 130,
                        image: bar2,
                        width: 80,
                        height: 170
                },
                [
                        {
                            text: 'Item(s) Sold by ' + order.Seller,
                            fontSize: 9
                    },
                        {
                            text: '\nPacakge Contains:' + order.Type,
                            fontSize: 9
                    },
                        {
                            columns: [
                                {
                                    text: '\nWeight: ' + order.Weight + ' kgs',
                                    fontSize: 10
                            },
                                {
                                    text: '\nShip Date: ' + order.ShippedDate,
                                    fontSize: 10
                            }
                        ]
                    },
                        {
                            text: 'Shipped By: Gatti Pvt Limited',
                            margin: [0, 15, 0, 0],
                            fontSize: 10
                    },
                        {
                            text: [
                                {
                                    text: "\nReturn Address: ",
                                    bold: true
                            },
                            '\n' + order.SellerAddress1,
                            '\n' + order.SellerAddress2 + ' ' + order.SellerAddress3,
                            '\n' + order.SellerCity + ' ' + order.SellerPinCode,
                            '\n' + order.SellerState
                        ]
                    }
                ]
            ]
        },
            {
                text: "___________________________________________________________"
        },
            {
                text: 'Customer Self Declaration: I herby confirm that the content of this package are being purchased for my internal and personal purpose and not for re-sale.',
                style: ['quote', 'small']
		},
            {
                columns: [
                    {
                        text: "GATTI_GROUNDS",
                        bold: true,
                        fontSize: 10
                },
                    {
                        text: order.SourceStationCode,
                        alignment: 'right',
                        bold: true,
                        fontSize: 10
                }
            ]
        }
	],
        styles: {
            receiverStyle: {
                fontSize: 10,
            },
            desCode: {
                margin: [20, 80, 0, 0],
                fontSize: 17
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            },
            quote: {
                italics: true
            },
            small: {
                fontSize: 8
            }
        },
        defaultStyle: {
            fontSize: 10
        }

    }

    return dd;

}
