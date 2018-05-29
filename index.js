$(function () {
    var dappContactAddress;
    var serialNumber;
    var NebPay;
    var nebPay;
    var nebulas;
    dappContactAddress = "n1fJdzAougmnKDwFUwHw3R1TUxsFPkSqnm5";
    nebulas = require("nebulas"), neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
    
    NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
    nebPay = new NebPay();	
    var myneb = new Neb();
    var nasApi = myneb.api;	

    var curWallectAdd;
    
    function getWallectInfo() {
        console.log("getWallectInfo");
        window.addEventListener('message', getMessage);
    
        window.postMessage({
            "target": "contentscript",
            "data": {},
            "method": "getAccount",
        }, "*");
    }
    
    function getMessage(e){
        if (e.data && e.data.data) {
            console.log("e.data.data:", e.data.data)
            if (e.data.data.account) {
                var address = e.data.data.account;
                curWallectAdd = address;
                console.log("address="+address);
            }
        }
       
    }

    function loginOrReg(){
        var to = dappContactAddress;
        var value = "0";
        var callFunction = "loginOrReg";
        var callArgs = "";
        console.log(callArgs);
        serialNumber = nebPay.call(to, value, callFunction, callArgs, { 
                listener: function (resp) {
                    try{
                        if(resp.indexOf("Transaction rejected by user") > 0){
                            alert("您拒绝了合约调用，请重试");
                        }
                    }catch(e){
                        var hash = resp.txhash;
                        regetTransactionReceipt(hash, function (status) {
                            if(status == 1){
                                alert('登录成功，刷新页面！');
                                location.reload();
                            }else{
                                alert('登录失败！');
                            }
                        })
                    }
                        //upadte card status into in progress...
                }
        }); 
    }

    function regetTransactionReceipt(hash, cb) {
        var task = setInterval(function () {
            getTransactionReceipt(hash, function (resp) {
//                console.log(resp)
                var status = resp.result.status;
                console.log('status:' +status)
                if(status == 1 || status == 0){
                    clearInterval(task);
                    cb(status);
                }
            })
        }, 1000);
    }

    function getTransactionReceipt(hash, cb){
        $.post('https://testnet.nebulas.io/v1/user/getTransactionReceipt', JSON.stringify({
            "hash": hash
        }), function (resp) {
            console.log(resp);
            cb(resp)
        })
    }

    function getAllNoteInfo(){
        var from = dappContactAddress;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "20000000";
        var callFunction = "getAllNoteInfo";
        var callArgs = "";
        // console.log("callFunction:" + callFunction + " callArgs:" + callArgs);
        var contract = {
        "function": callFunction,
        "args": callArgs
        };
    neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;   
        console.log("getAllNoteInfo result : " + result);
        result = JSON.parse(result);
        setItemsProperties(result);
    }).catch(function (err) {
        console.log("error :" + err.message);
    })
   }

   function setItemsProperties(itemList) {
        console.log(itemList);
        var html = "";
        for(var i = 0, iLen = itemList.length; i < iLen; i++) {
            randomIndex = (i + 1) % 4;
            // var i = Math.random();
            // var randomIndex = Math.ceil(i*30);
            console.log("randomIndex:" + randomIndex);
            // randomIndex = 1;
            html += 
            '<li class="card_info_li" id=' + i + '>' + 
            '<img src="images/img' + randomIndex + '.jpg" width="200" height="200">' + 
            '<div class="post-info">' + 
                '<div class="post-basic-info">' + 
                    '<h3>' + itemList[i].title + '</h3>' +
                    '<span><label> </label>文章价格：' + itemList[i].fee + '</span>' + 
                    '<p>' + itemList[i].content + '</p>' + 
                '</div>' + 
                '<div class="post-info-rate-share">' + 
                    '<div class="rateit_totle">' + 
                        '<span> 购买人数：' + itemList[i].ownedUserId.length + '</span>' + 
                    '</div>' + 
                    '<div class="post-share">' + 
                        '<span> </span>' + 
                    '</div>' + 
                    '<div class="clear"> </div>' + 
                '</div>' + 
            '</div>' + 
        '</li>';

            console.log(html);
        }
        hideLoading();
        $('#tiles').append(html);
        resizeLi();
        applyLayout();

        $(".card_info_li").on("click", function(event) {
            var currentIndex = event.currentTarget.id;
            // location.href="detail_page.html?page=" + currentIndex + "";
            isCurUserPayed(currentIndex,itemList[currentIndex].fee)
        });
   }

  function resizeLi(){
        $tiles = $('#tiles'),
        $handler = $('li', $tiles),
        $main = $('#main'),
        $window = $(window),
        $document = $(document),
        options = {
          autoResize: true, // This will auto-update the layout when the browser window is resized.
          container: $main, // Optional, used for some extra CSS styling
          offset: 20, // Optional, the distance between grid items
          itemWidth:280 // Optional, the width of a grid item
        };
    }
    /**
     * Reinitializes the wookmark handler after all images have loaded
     */
    function applyLayout() {
      $tiles.imagesLoaded(function() {
        // Destroy the old handler
        if ($handler.wookmarkInstance) {
          $handler.wookmarkInstance.clear();
        }

        // Create a new layout handler.
        $handler = $('li', $tiles);
        $handler.wookmark(options);
      });
    }

    function hideLoading(){
        console.log("hideLoading");
        // $(window).load(function() {
			$("#loading").fadeOut("slow");
		// })
    }

    function buyANote(id){
        var to = dappContactAddress;
        var value = "0";
        var callFunction = "buyANote";
        var callArgs = "[\"" + id + "\"]";
        console.log(callArgs);
        serialNumber = nebPay.call(to, value, callFunction, callArgs, { 
                listener: function (resp) {
                    try{
                        if(resp.indexOf("Transaction rejected by user") > 0){
                            alert("您拒绝了合约调用，请重试");
                        }
                    }catch(e){
                        var hash = resp.txhash;
                        alert('购买中，请稍后');
                        regetTransactionReceipt(hash, function (status) {
                            if(status == 1){
                                location.href="detail_page.html?page=" + id; 
                                // location.reload();
                            }else{
                                alert('购买失败！');
                            }
                        })
                    }
                        //upadte card status into in progress...
                }
        }); 
    }

    function isCurUserPayed(id,fee){
        var from = curWallectAdd;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "20000000";
        var callFunction = "isCurUserPayed";
        var callArgs = "[\"" + id + "\"]";
        // console.log("callFunction:" + callFunction + " callArgs:" + callArgs);
        var contract = {
        "function": callFunction,
        "args": callArgs
        };
    neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;   
        console.log("isCurUserPayed result : " + result);
        result = JSON.parse(result);
        if(result == true){
            location.href="detail_page.html?page=" + id + ""; 
        }else{
            var r = confirm('您将支付' + fee + "was, 用来购买本文章内容！")
            if(r == false){
                return;
            }
            buyANote(id);
        }

    }).catch(function (err) {
        console.log("error :" + err.message);
    }) 
    }

    $("#login_btn").on("click", function(event) {
        loginOrReg();
    });

    getAllNoteInfo();
    getWallectInfo()
})